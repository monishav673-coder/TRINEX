import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { logAudit } from '../middleware/auditMiddleware.js';

const router = express.Router();

// GET /api/officer/dashboard (Aggregated KPI metrics and chart statistics)
router.get('/dashboard', authenticateToken, authorizeRoles('officer', 'admin'), (req, res) => {
  try {
    const totalApplications = db.prepare('SELECT COUNT(*) as count FROM applications').get().count;
    const pendingVerification = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status IN ('Submitted', 'Document Verification', 'Institution Verification')").get().count;
    const manualReviewCount = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status IN ('Manual Review Required', 'Clarification Required', 'Action Required')").get().count;
    const approvedCount = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status IN ('Department Verification', 'Sanctioned', 'Completed')").get().count;
    const sanctionedCount = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status IN ('Sanctioned', 'Disbursement', 'Completed')").get().count;
    const disbursedCount = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Completed'").get().count;
    const unreachedCount = db.prepare("SELECT COUNT(*) as count FROM beneficiary_outreach WHERE outreach_status IN ('Potentially Unreached', 'Requires Review')").get().count;

    // Status breakdown for Recharts
    const statusDistribution = [
      { name: 'Submitted', count: db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Submitted'").get().count, color: '#3B82F6' },
      { name: 'Doc Verification', count: db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Document Verification'").get().count, color: '#6366F1' },
      { name: 'Institute Check', count: db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Institution Verification'").get().count, color: '#8B5CF6' },
      { name: 'Dept Scrutiny', count: db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Department Verification'").get().count, color: '#0EA5E9' },
      { name: 'Manual Review', count: db.prepare("SELECT COUNT(*) as count FROM applications WHERE status IN ('Manual Review Required', 'Clarification Required', 'Action Required')").get().count, color: '#F59E0B' },
      { name: 'Sanctioned', count: db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'Sanctioned'").get().count, color: '#10B981' },
      { name: 'Disbursed', count: db.prepare("SELECT COUNT(*) as count FROM applications WHERE status IN ('Disbursement', 'Completed')").get().count, color: '#059669' }
    ];

    // Monthly trends (Sample series)
    const monthlyTrends = [
      { month: 'Apr 2026', received: 120, verified: 95, sanctioned: 80 },
      { month: 'May 2026', received: 180, verified: 150, sanctioned: 130 },
      { month: 'Jun 2026', received: 310, verified: 260, sanctioned: 220 },
      { month: 'Jul 2026', received: 450, verified: 390, sanctioned: 340 },
      { month: 'Aug 2026', received: 620, verified: 510, sanctioned: 480 },
      { month: 'Sep 2026', received: 780, verified: 650, sanctioned: 590 }
    ];

    // Scheme distribution
    const schemeDistribution = [
      { name: 'Post-Matric ST', value: 45, color: '#1E40AF' },
      { name: 'Pre-Matric ST', value: 30, color: '#2563EB' },
      { name: 'Top Class Premier', value: 12, color: '#F97316' },
      { name: 'NFST Fellowships', value: 8, color: '#7C3AED' },
      { name: 'NOS Overseas', value: 5, color: '#0D9488' }
    ];

    // Payment status overview
    const paymentStatus = [
      { status: 'Sanctioned', amount: '₹1.84 Cr', count: 480 },
      { status: 'In Processing (PFMS)', amount: '₹1.12 Cr', count: 320 },
      { status: 'Disbursed to Bank', amount: '₹2.45 Cr', count: 640 },
      { status: 'Pending Approval', amount: '₹0.65 Cr', count: 180 }
    ];

    return res.json({
      success: true,
      stats: {
        totalApplications: totalApplications + 2580, // realistic scale
        pendingVerification: pendingVerification + 340,
        manualReviewCount: manualReviewCount + 48,
        approvedCount: approvedCount + 1920,
        sanctionedCount: sanctionedCount + 1850,
        disbursedCount: disbursedCount + 1420,
        unreachedCount: unreachedCount + 850
      },
      statusDistribution,
      monthlyTrends,
      schemeDistribution,
      paymentStatus,
      environment: 'DEMO / SANDBOX ANALYTICS'
    });
  } catch (err) {
    console.error('[Officer Dashboard Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve officer metrics.' });
  }
});

// GET /api/officer/reviews (Manual review queue)
router.get('/reviews', authenticateToken, authorizeRoles('officer', 'admin'), (req, res) => {
  try {
    const queue = db.prepare(`
      SELECT a.id as application_id, a.application_no, a.status as application_status, a.submission_date,
             s.title as scholarship_title, s.category as scholarship_category,
             u.full_name as student_name, u.email as student_email, u.mobile as student_mobile,
             sp.id as student_profile_id, sp.student_id as student_code, sp.state, sp.district, sp.institution,
             sp.family_income,
             v.id as verification_id, v.service_name as mismatch_service, v.status as verification_status,
             v.mismatch_reason, v.clarification_note
      FROM applications a
      JOIN scholarships s ON s.id = a.scholarship_id
      JOIN student_profiles sp ON sp.id = a.student_id
      JOIN users u ON u.id = sp.user_id
      LEFT JOIN verification_records v ON v.application_id = a.id AND (v.status = 'MISMATCH' OR v.status = 'PENDING_REVIEW')
      WHERE a.status IN ('Manual Review Required', 'Department Verification', 'Action Required', 'Clarification Required')
         OR v.status IN ('MISMATCH', 'PENDING_REVIEW')
      ORDER BY a.created_at DESC
    `).all();

    return res.json({
      success: true,
      count: queue.length,
      queue: queue.map(item => ({
        ...item,
        priority: item.mismatch_service ? 'High' : 'Normal',
        date: item.submission_date || '28 Sep 2026'
      }))
    });
  } catch (err) {
    console.error('[Manual Review Queue Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve review queue.' });
  }
});

// POST /api/officer/reviews/:id (Officer action: 'Request Clarification', 'Mark Verified', 'Return for Correction')
router.post('/reviews/:id', authenticateToken, authorizeRoles('officer', 'admin'), (req, res) => {
  try {
    const { actionTaken, comments, newStatus } = req.body;
    const appId = req.params.id;

    if (!['Request Clarification', 'Mark Verified', 'Return for Correction', 'Approve Sanction'].includes(actionTaken)) {
      return res.status(400).json({ success: false, message: 'Invalid officer review action.' });
    }

    const application = db.prepare('SELECT a.*, sp.user_id FROM applications a JOIN student_profiles sp ON sp.id = a.student_id WHERE a.id = ? OR a.application_no = ?').get(appId, appId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found.' });
    }

    // Determine target status
    let updatedStatus = application.status;
    let notifTitle = 'Application Review Update';
    let notifType = 'INFO';

    if (actionTaken === 'Mark Verified') {
      updatedStatus = 'Department Verification';
      notifTitle = 'Verification Discrepancy Resolved';
      notifType = 'SUCCESS';
      // Mark mismatch records verified
      db.prepare("UPDATE verification_records SET status = 'VERIFIED_MANUAL' WHERE application_id = ? AND status IN ('MISMATCH', 'PENDING_REVIEW')").run(application.id);
    } else if (actionTaken === 'Request Clarification') {
      updatedStatus = 'Clarification Required';
      notifTitle = 'Officer Clarification Requested';
      notifType = 'WARNING';
    } else if (actionTaken === 'Return for Correction') {
      updatedStatus = 'Action Required';
      notifTitle = 'Application Returned for Correction';
      notifType = 'WARNING';
    } else if (actionTaken === 'Approve Sanction') {
      updatedStatus = 'Sanctioned';
      notifTitle = 'Scholarship Sanction Approved';
      notifType = 'SUCCESS';
    }

    if (newStatus) updatedStatus = newStatus;

    // Update application status
    db.prepare(`
      UPDATE applications SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(updatedStatus, application.id);

    // Record review log
    const reviewId = 'rev-' + uuidv4().substring(0, 8);
    db.prepare(`
      INSERT INTO officer_reviews (id, officer_id, application_id, action_taken, comments, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(reviewId, req.user.id, application.id, actionTaken, comments || `Action executed: ${actionTaken}`);

    // Append to timeline
    db.prepare(`
      INSERT INTO application_status_history (id, application_id, status, notes, updated_by, timestamp)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(uuidv4(), application.id, updatedStatus, comments || `Officer review action: ${actionTaken}`, req.user.full_name);

    // Send student notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, action_url, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'))
    `).run(
      uuidv4(),
      application.user_id,
      notifTitle,
      `Officer Note: ${comments || 'Your application status has been updated to ' + updatedStatus}`,
      notifType,
      `/applications/${application.id}`
    );

    logAudit(req.user.id, req.user.email, 'officer', 'OFFICER_REVIEW_ACTION', 'APPLICATION', application.id, { actionTaken, comments, updatedStatus }, req);

    return res.json({
      success: true,
      message: `Action "${actionTaken}" recorded successfully. Application status is now "${updatedStatus}".`,
      applicationId: application.id,
      updatedStatus
    });
  } catch (err) {
    console.error('[Officer Review Action Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to record officer review action.' });
  }
});

// GET /api/officer/beneficiaries (Beneficiary Insight module)
router.get('/beneficiaries', authenticateToken, authorizeRoles('officer', 'admin'), (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM beneficiary_outreach ORDER BY matching_confidence DESC').all();
    return res.json({
      success: true,
      count: list.length,
      beneficiaries: list,
      description: 'Matching Engine identified potentially unreached ST students from educational databases for authorized outreach and review.'
    });
  } catch (err) {
    console.error('[Beneficiaries Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to load beneficiary insight data.' });
  }
});

export default router;
