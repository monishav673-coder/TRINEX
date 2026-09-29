import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { logAudit } from '../middleware/auditMiddleware.js';

const router = express.Router();

// GET /api/applications (List applications)
router.get('/', authenticateToken, (req, res) => {
  try {
    let applications;
    if (req.user.role === 'student') {
      const profile = req.studentProfile;
      if (!profile) {
        return res.json({ success: true, count: 0, applications: [] });
      }
      applications = db.prepare(`
        SELECT a.*, s.title as scholarship_title, s.category as scholarship_category, s.code as scholarship_code, s.max_amount, s.icon_name
        FROM applications a
        JOIN scholarships s ON s.id = a.scholarship_id
        WHERE a.student_id = ?
        ORDER BY a.created_at DESC
      `).all(profile.id);
    } else {
      // Officer view
      applications = db.prepare(`
        SELECT a.*, s.title as scholarship_title, s.category as scholarship_category, s.code as scholarship_code, s.max_amount,
               sp.student_id as student_code, u.full_name as student_name, u.email as student_email, u.mobile as student_mobile,
               sp.state, sp.district, sp.institution, sp.course
        FROM applications a
        JOIN scholarships s ON s.id = a.scholarship_id
        JOIN student_profiles sp ON sp.id = a.student_id
        JOIN users u ON u.id = sp.user_id
        ORDER BY a.created_at DESC
      `).all();
    }

    const enriched = applications.map(app => ({
      ...app,
      data: JSON.parse(app.data_json || '{}')
    }));

    return res.json({ success: true, count: enriched.length, applications: enriched });
  } catch (err) {
    console.error('[Applications GET Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve applications.' });
  }
});

// GET /api/applications/:id (Application details)
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const app = db.prepare(`
      SELECT a.*, s.title as scholarship_title, s.category as scholarship_category, s.code as scholarship_code,
             s.description as scholarship_description, s.max_amount, s.education_level, s.icon_name,
             sp.student_id as student_code, sp.dob, sp.gender, sp.state, sp.district, sp.institution,
             sp.course, sp.year_of_study, sp.st_status, sp.pvtg_status, sp.family_income,
             u.full_name as student_name, u.email as student_email, u.mobile as student_mobile
      FROM applications a
      JOIN scholarships s ON s.id = a.scholarship_id
      JOIN student_profiles sp ON sp.id = a.student_id
      JOIN users u ON u.id = sp.user_id
      WHERE (a.id = ? OR a.application_no = ?)
    `).get(req.params.id, req.params.id);

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application record not found.' });
    }

    // Security check for student
    if (req.user.role === 'student' && req.studentProfile && app.student_id !== req.studentProfile.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this application.' });
    }

    // Fetch timeline
    const timeline = db.prepare(`
      SELECT * FROM application_status_history
      WHERE application_id = ?
      ORDER BY timestamp ASC
    `).all(app.id);

    // Fetch documents
    const documents = db.prepare(`
      SELECT * FROM documents
      WHERE student_id = ?
      ORDER BY uploaded_at DESC
    `).all(app.student_id);

    // Fetch verification records
    const verificationRecords = db.prepare(`
      SELECT * FROM verification_records
      WHERE application_id = ?
      ORDER BY checked_at ASC
    `).all(app.id);

    // Fetch payment record
    const payment = db.prepare(`
      SELECT * FROM payments
      WHERE application_id = ?
    `).get(app.id);

    // Fetch officer reviews
    const officerReviews = db.prepare(`
      SELECT r.*, u.full_name as officer_name, u.email as officer_email
      FROM officer_reviews r
      JOIN users u ON u.id = r.officer_id
      WHERE r.application_id = ?
      ORDER BY r.created_at DESC
    `).all(app.id);

    return res.json({
      success: true,
      application: {
        ...app,
        data: JSON.parse(app.data_json || '{}'),
        timeline,
        documents,
        verificationRecords: verificationRecords.map(v => ({
          ...v,
          details: JSON.parse(v.details_json || '{}')
        })),
        payment: payment ? {
          ...payment,
          paymentTimeline: JSON.parse(payment.payment_timeline_json || '[]')
        } : null,
        officerReviews
      }
    });
  } catch (err) {
    console.error('[Application GET by ID Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve application details.' });
  }
});

// POST /api/applications (Create new application)
router.post('/', authenticateToken, (req, res) => {
  try {
    const profile = req.studentProfile;
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Please complete your student profile first.' });
    }

    const { scholarshipId, academicYear, formData, selectedDocuments } = req.body;

    if (!scholarshipId) {
      return res.status(400).json({ success: false, message: 'Scholarship scheme selection is required.' });
    }

    const scholarship = db.prepare('SELECT * FROM scholarships WHERE id = ?').get(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Selected scholarship scheme does not exist.' });
    }

    const currentYear = new Date().getFullYear();
    const randomSeq = Math.floor(10000 + Math.random() * 90000);
    const applicationNo = `TRX-${currentYear}-${randomSeq}`;
    const appId = 'app-' + uuidv4().substring(0, 8);
    const submissionDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    db.prepare(`
      INSERT INTO applications (id, application_no, student_id, scholarship_id, status, submission_date, academic_year, data_json, created_at)
      VALUES (?, ?, ?, ?, 'Submitted', ?, ?, ?, datetime('now'))
    `).run(
      appId,
      applicationNo,
      profile.id,
      scholarshipId,
      submissionDate,
      academicYear || `${currentYear}-${currentYear + 1}`,
      JSON.stringify(formData || {})
    );

    // Initial timeline record
    db.prepare(`
      INSERT INTO application_status_history (id, application_id, status, notes, updated_by, timestamp)
      VALUES (?, ?, 'Submitted', 'Application submitted through TRINEX student portal.', ?, datetime('now'))
    `).run(uuidv4(), appId, req.user.full_name);

    // Create automatic initial VeriCore integration sandbox checks
    const services = [
      { name: 'DigiLocker', status: 'MATCHED', details: { source: 'DigiLocker Demo Sandbox', verifiedDocs: ['ST Certificate'] } },
      { name: 'UDISE+', status: 'MATCHED', details: { schoolCheck: 'Valid active enrollment' } },
      { name: 'APAAR', status: 'MATCHED', details: { apaarId: 'APAAR-' + randomSeq, matchConfidence: '99%' } },
      { name: 'AISHE', status: 'MATCHED', details: { instituteValidation: 'Recognized College' } },
      { name: 'UIDAI', status: 'MATCHED', details: { demographicAuth: 'Verified (Demo)', bankSeeded: true } }
    ];

    for (const svc of services) {
      db.prepare(`
        INSERT INTO verification_records (id, application_id, service_name, status, details_json, checked_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).run(uuidv4(), appId, svc.name, svc.status, JSON.stringify(svc.details));
    }

    // Create Notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, action_url, is_read, created_at)
      VALUES (?, ?, ?, ?, 'SUCCESS', ?, 0, datetime('now'))
    `).run(
      uuidv4(),
      req.user.id,
      'Application Submitted Successfully',
      `Your application ${applicationNo} for "${scholarship.title}" has been registered. Initial automated checks have commenced in VeriCore.`,
      `/applications/${appId}`
    );

    logAudit(req.user.id, req.user.email, req.user.role, 'CREATE_APPLICATION', 'APPLICATION', appId, { applicationNo, scholarshipId }, req);

    return res.status(201).json({
      success: true,
      message: 'Application Submitted Successfully',
      applicationId: appId,
      applicationNo,
      submissionDate,
      scheme: scholarship.title,
      currentStatus: 'Submitted'
    });
  } catch (err) {
    console.error('[Application Create Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
});

// GET /api/applications/:id/timeline
router.get('/:id/timeline', authenticateToken, (req, res) => {
  try {
    const timeline = db.prepare(`
      SELECT * FROM application_status_history
      WHERE application_id = ? OR application_id IN (SELECT id FROM applications WHERE application_no = ?)
      ORDER BY timestamp ASC
    `).all(req.params.id, req.params.id);

    return res.json({ success: true, timeline });
  } catch (err) {
    console.error('[Timeline GET Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve status timeline.' });
  }
});

export default router;
