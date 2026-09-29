import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { logAudit } from '../middleware/auditMiddleware.js';

const router = express.Router();

// GET /api/documents (List documents for logged in student or specified student)
router.get('/', authenticateToken, (req, res) => {
  try {
    let studentId;
    if (req.user.role === 'student') {
      if (!req.studentProfile) {
        return res.json({ success: true, count: 0, documents: [] });
      }
      studentId = req.studentProfile.id;
    } else {
      // Officer querying specific student's documents
      studentId = req.query.studentId;
    }

    let query = 'SELECT * FROM documents WHERE 1=1';
    const params = [];

    if (studentId) {
      query += ' AND student_id = ?';
      params.push(studentId);
    }

    query += ' ORDER BY uploaded_at DESC';
    const documents = db.prepare(query).all(...params);

    return res.json({ success: true, count: documents.length, documents });
  } catch (err) {
    console.error('[Documents GET Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve documents.' });
  }
});

// POST /api/documents (Upload document to DigiVault)
router.post('/', authenticateToken, upload.single('file'), (req, res) => {
  try {
    const profile = req.studentProfile;
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Student profile required for document upload.' });
    }

    const { documentType, expiryDate, applicationId } = req.body;
    if (!documentType) {
      return res.status(400).json({ success: false, message: 'Document category/type is required.' });
    }

    let fileName = 'Sample_Document.pdf';
    let fileUrl = '/uploads/sample.pdf';
    let fileSize = '1.5 MB';
    let mimeType = 'application/pdf';

    if (req.file) {
      fileName = req.file.originalname;
      fileUrl = `/uploads/${req.file.filename}`;
      fileSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
      mimeType = req.file.mimetype;
    }

    const docId = 'doc-' + uuidv4().substring(0, 8);

    db.prepare(`
      INSERT INTO documents (id, student_id, application_id, document_type, file_name, file_url, file_size, mime_type, verification_status, expiry_date, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Uploaded', ?, datetime('now'))
    `).run(
      docId,
      profile.id,
      applicationId || null,
      documentType,
      fileName,
      fileUrl,
      fileSize,
      mimeType,
      expiryDate || 'Lifetime'
    );

    const newDoc = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId);
    logAudit(req.user.id, req.user.email, req.user.role, 'UPLOAD_DOCUMENT', 'DOCUMENT', docId, { documentType, fileName }, req);

    return res.status(201).json({
      success: true,
      message: 'Document saved to DigiVault successfully.',
      document: newDoc
    });
  } catch (err) {
    console.error('[Document Upload Error]', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to upload document.' });
  }
});

// DELETE /api/documents/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found.' });
    }

    if (req.user.role === 'student' && req.studentProfile && doc.student_id !== req.studentProfile.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this document.' });
    }

    db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);
    logAudit(req.user.id, req.user.email, req.user.role, 'DELETE_DOCUMENT', 'DOCUMENT', req.params.id, { docName: doc.file_name }, req);

    return res.json({ success: true, message: 'Document removed from DigiVault.' });
  } catch (err) {
    console.error('[Document Delete Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to delete document.' });
  }
});

// POST /api/documents/digilocker-sync (Demo/Sandbox DigiLocker pull)
router.post('/digilocker-sync', authenticateToken, (req, res) => {
  try {
    const profile = req.studentProfile;
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Student profile required.' });
    }

    // Add demo verified DigiLocker docs if not present
    const demoDocs = [
      { type: 'Identity Document', name: 'DigiLocker_Aadhaar_Verified.pdf', size: '1.1 MB', status: 'Verified' },
      { type: 'ST Certificate', name: 'DigiLocker_ST_Caste_Certificate.pdf', size: '1.9 MB', status: 'Verified' },
      { type: 'Domicile Certificate', name: 'DigiLocker_State_Domicile.pdf', size: '1.3 MB', status: 'Verified' }
    ];

    let addedCount = 0;
    for (const d of demoDocs) {
      const existing = db.prepare('SELECT id FROM documents WHERE student_id = ? AND document_type = ?').get(profile.id, d.type);
      if (!existing) {
        db.prepare(`
          INSERT INTO documents (id, student_id, document_type, file_name, file_url, file_size, mime_type, verification_status, expiry_date, uploaded_at)
          VALUES (?, ?, ?, ?, '/sample-docs/digilocker_sample.pdf', ?, 'application/pdf', ?, 'Lifetime', datetime('now'))
        `).run(uuidv4(), profile.id, d.type, d.name, d.size, d.status);
        addedCount++;
      }
    }

    return res.json({
      success: true,
      message: `DigiLocker Sandbox Synchronized. ${addedCount} digital credentials verified & pulled.`,
      environment: 'DEMO / SANDBOX'
    });
  } catch (err) {
    console.error('[DigiLocker Sync Error]', err);
    return res.status(500).json({ success: false, message: 'DigiLocker sync failed.' });
  }
});

export default router;
