import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'trinex_super_secret_jwt_key_2026_tribal_scholarship_ecosystem';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required. Please sign in to continue.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, email, full_name, mobile, role, is_active FROM users WHERE id = ?').get(decoded.id);

    if (!user || !user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive or not found.'
      });
    }

    req.user = user;

    // Attach student profile if role is student
    if (user.role === 'student') {
      const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(user.id);
      req.studentProfile = profile || null;
    }

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: ${roles.join(', ')}`
      });
    }
    next();
  };
}
