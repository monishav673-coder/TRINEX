import { db } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export function logAudit(userId, userEmail, userRole, action, resourceType, resourceId, details, req) {
  try {
    const ip = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') : '127.0.0.1';
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_email, user_role, action, resource_type, resource_id, ip_address, details_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      uuidv4(),
      userId || null,
      userEmail || 'anonymous',
      userRole || 'public',
      action,
      resourceType,
      resourceId || null,
      String(ip),
      typeof details === 'object' ? JSON.stringify(details) : details
    );
  } catch (err) {
    console.error('[Audit Log Error]', err.message);
  }
}
