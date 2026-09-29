import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/payments (FundTrack overview)
router.get('/', authenticateToken, (req, res) => {
  try {
    let payments;
    if (req.user.role === 'student') {
      const profile = req.studentProfile;
      if (!profile) {
        return res.json({ success: true, count: 0, payments: [] });
      }
      payments = db.prepare(`
        SELECT p.*, s.title as scholarship_title, s.category as scholarship_category, s.code as scholarship_code,
               a.application_no, a.status as application_status
        FROM payments p
        JOIN scholarships s ON s.id = p.scholarship_id
        JOIN applications a ON a.id = p.application_id
        WHERE p.student_id = ?
        ORDER BY p.created_at DESC
      `).all(profile.id);
    } else {
      payments = db.prepare(`
        SELECT p.*, s.title as scholarship_title, s.category as scholarship_category,
               a.application_no, sp.student_id as student_code, u.full_name as student_name
        FROM payments p
        JOIN scholarships s ON s.id = p.scholarship_id
        JOIN applications a ON a.id = p.application_id
        JOIN student_profiles sp ON sp.id = p.student_id
        JOIN users u ON u.id = sp.user_id
        ORDER BY p.created_at DESC
      `).all();
    }

    const parsed = payments.map(p => ({
      ...p,
      paymentTimeline: JSON.parse(p.payment_timeline_json || '[]'),
      isMockData: true,
      environment: 'DEMO / SANDBOX'
    }));

    // Aggregate summary statistics
    const totalSanctioned = parsed.reduce((sum, item) => sum + (Number(item.sanctioned_amount) || 0), 0);
    const totalDisbursed = parsed.reduce((sum, item) => sum + (Number(item.disbursed_amount) || 0), 0);
    const totalPending = parsed.reduce((sum, item) => sum + (Number(item.pending_amount) || 0), 0);

    return res.json({
      success: true,
      summary: {
        totalSanctioned,
        totalDisbursed,
        totalPending,
        activeTransactions: parsed.length
      },
      payments: parsed,
      disclaimer: 'For demonstration purposes, sample transaction references and masked bank accounts are displayed.'
    });
  } catch (err) {
    console.error('[Payments GET Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve payment records.' });
  }
});

export default router;
