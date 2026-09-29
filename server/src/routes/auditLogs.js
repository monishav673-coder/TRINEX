import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/audit-logs
router.get('/', authenticateToken, authorizeRoles('officer', 'admin'), (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
    return res.json({
      success: true,
      count: logs.length,
      auditLogs: logs.map(l => ({
        ...l,
        details: JSON.parse(l.details_json || '{}')
      }))
    });
  } catch (err) {
    console.error('[Audit Logs GET Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve audit logs.' });
  }
});

export default router;
