import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { logAudit } from '../middleware/auditMiddleware.js';

const router = express.Router();

// GET /api/verification/vericore-overview (Summary of all system integration cards)
router.get('/vericore-overview', authenticateToken, (req, res) => {
  try {
    let studentId = req.studentProfile ? req.studentProfile.id : null;
    let appId = req.query.applicationId;

    if (!appId && studentId) {
      const latestApp = db.prepare('SELECT id FROM applications WHERE student_id = ? ORDER BY created_at DESC LIMIT 1').get(studentId);
      if (latestApp) appId = latestApp.id;
    }

    let records = [];
    if (appId) {
      records = db.prepare('SELECT * FROM verification_records WHERE application_id = ?').all(appId);
    }

    // List all 10 unified integration services
    const services = [
      { id: 'digilocker', name: 'DigiLocker', type: 'Digital Credentials', description: 'Central digital repository for ST, caste, and income certificates.' },
      { id: 'udise', name: 'UDISE+', type: 'School Education Records', description: 'Unified District Information System for Education student records.' },
      { id: 'apaar', name: 'APAAR', type: 'Automated Permanent Academic Account Registry', description: 'One Nation One Student ID credit mapping.' },
      { id: 'aishe', name: 'AISHE', type: 'Higher Education Registry', description: 'All India Survey on Higher Education institution verification.' },
      { id: 'edistrict', name: 'State e-District', type: 'Revenue Authority', description: 'State-level land, income, and revenue authority certificate lookup.' },
      { id: 'ugcnta', name: 'UGC / NTA', type: 'Entrance & Eligibility Agency', description: 'National Testing Agency exam scores and UGC-NET verification.' },
      { id: 'nsp', name: 'NSP', type: 'National Scholarship Portal', description: 'Central de-duplication and previous fellowship cross-checks.' },
      { id: 'sfmp', name: 'SFMP', type: 'State Financial Management Portal', description: 'State-level treasury and DBT clearing interface.' },
      { id: 'nos', name: 'NOS', type: 'National Overseas Portal', description: 'QS ranking validation and overseas visa verification.' },
      { id: 'uidai', name: 'UIDAI', type: 'Aadhaar Demographic Sandbox', description: 'Aadhaar identity and DBT bank-seeding status check.' }
    ];

    const mapped = services.map(svc => {
      const match = records.find(r => r.service_name.toLowerCase().includes(svc.name.toLowerCase()) || svc.name.toLowerCase().includes(r.service_name.toLowerCase()));
      return {
        ...svc,
        status: match ? match.status : 'MATCHED',
        lastChecked: match ? match.checked_at : '28 Sep 2026',
        details: match ? JSON.parse(match.details_json || '{}') : { source: `${svc.name} Demo Sandbox`, verified: true },
        mismatchReason: match ? match.mismatch_reason : null,
        clarificationNote: match ? match.clarification_note : null,
        environment: 'DEMO / SANDBOX',
        isPrototype: true
      };
    });

    return res.json({
      success: true,
      title: 'VeriCore - Unified Scholarship Verification Center',
      environment: 'DEMO / SANDBOX',
      notice: 'Prototype / Demo Environment. Automated mismatches are routed to Manual Review rather than automatic rejection.',
      integrations: mapped
    });
  } catch (err) {
    console.error('[VeriCore Overview Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve VeriCore overview.' });
  }
});

// GET /api/verification/:applicationId
router.get('/:applicationId', authenticateToken, (req, res) => {
  try {
    const records = db.prepare('SELECT * FROM verification_records WHERE application_id = ?').all(req.params.applicationId);
    return res.json({
      success: true,
      records: records.map(r => ({
        ...r,
        details: JSON.parse(r.details_json || '{}')
      }))
    });
  } catch (err) {
    console.error('[Verification Records GET Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve verification records.' });
  }
});

// POST /api/verification/:id/clarification (Student submits clarification for a mismatch)
router.post('/:id/clarification', authenticateToken, (req, res) => {
  try {
    const { clarificationText, documentId } = req.body;
    if (!clarificationText) {
      return res.status(400).json({ success: false, message: 'Please provide clarification details.' });
    }

    const record = db.prepare('SELECT * FROM verification_records WHERE id = ? OR service_name = ?').get(req.params.id, req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Verification record not found.' });
    }

    db.prepare(`
      UPDATE verification_records
      SET clarification_note = ?, status = 'PENDING_REVIEW', checked_at = datetime('now')
      WHERE id = ?
    `).run(clarificationText, record.id);

    // Update application status to Manual Review Required
    db.prepare(`
      UPDATE applications SET status = 'Manual Review Required', updated_at = datetime('now')
      WHERE id = ?
    `).run(record.application_id);

    db.prepare(`
      INSERT INTO application_status_history (id, application_id, status, notes, updated_by, timestamp)
      VALUES (?, ?, 'Manual Review Required', ?, ?, datetime('now'))
    `).run(uuidv4(), record.application_id, `Student clarification submitted: "${clarificationText}"`, req.user.full_name);

    logAudit(req.user.id, req.user.email, req.user.role, 'SUBMIT_CLARIFICATION', 'VERIFICATION', record.id, { clarificationText }, req);

    return res.json({
      success: true,
      message: 'Clarification submitted successfully. An officer will manually review your response.'
    });
  } catch (err) {
    console.error('[Clarification Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to submit clarification.' });
  }
});

export default router;
