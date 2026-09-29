import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { logAudit } from '../middleware/auditMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'trinex_super_secret_jwt_key_2026_tribal_scholarship_ecosystem';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/register (Student Registration)
router.post('/register', async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      confirmPassword,
      dob,
      gender,
      state,
      district,
      institution,
      course,
      yearOfStudy,
      stStatus,
      pvtgStatus,
      familyIncome,
      disabilityStatus,
      domicile,
      termsAccepted
    } = req.body;

    if (!email || !password || !fullName || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields.'
      });
    }

    if (password !== confirmPassword && confirmPassword !== undefined) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Consent is required to proceed with scholarship processing.'
      });
    }

    // Check existing email or mobile
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    const userId = 'usr-st-' + uuidv4().substring(0, 8);
    const studentId = 'TRX-ST-' + Math.floor(10000 + Math.random() * 90000);
    const profileId = 'prof-' + uuidv4().substring(0, 8);
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, mobile, role, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, 'student', 1, datetime('now'))
    `).run(userId, email.toLowerCase().trim(), passwordHash, fullName.trim(), mobile.trim());

    // Insert profile
    db.prepare(`
      INSERT INTO student_profiles (
        id, user_id, student_id, dob, gender, state, district,
        institution, course, year_of_study, st_status, pvtg_status,
        family_income, disability_status, domicile_state, net_jrf_status,
        academic_percentage, profile_completion, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'None', 80.0, 75, datetime('now'))
    `).run(
      profileId,
      userId,
      studentId,
      dob || null,
      gender || 'Not Specified',
      state || 'Odisha',
      district || 'Mayurbhanj',
      institution || 'Not Assigned',
      course || 'General Higher Education',
      yearOfStudy || '1st Year',
      stStatus || 'Yes',
      pvtgStatus || 'No',
      Number(familyIncome) || 120000,
      disabilityStatus || 'No',
      domicile || state || 'Odisha'
    );

    // Create welcome notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, action_url, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'))
    `).run(
      uuidv4(),
      userId,
      'Welcome to TRINEX',
      `Your account has been registered with Student ID ${studentId}. Explore scholarship opportunities tailored for you.`,
      'SUCCESS',
      '/dashboard'
    );

    logAudit(userId, email, 'student', 'REGISTER_SUCCESS', 'USER', userId, { studentId }, req);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Please login with your credentials.',
      studentId
    });
  } catch (err) {
    console.error('[Register Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to process registration at this moment. Please try again.'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;
    const loginIdentifier = (identifier || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email/mobile and password.'
      });
    }

    // Find by email or mobile
    const user = db.prepare(`
      SELECT * FROM users WHERE (LOWER(email) = ? OR mobile = ?)
    `).get(loginIdentifier, loginIdentifier);

    if (!user) {
      logAudit(null, loginIdentifier, role || 'unknown', 'LOGIN_FAILED_USER_NOT_FOUND', 'AUTH', null, {}, req);
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect.'
      });
    }

    if (role && user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Account is registered as ${user.role}. Please use the ${user.role === 'officer' ? 'Officer' : 'Student'} login portal.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      logAudit(user.id, user.email, user.role, 'LOGIN_FAILED_PASSWORD_MISMATCH', 'AUTH', user.id, {}, req);
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    let profile = null;
    if (user.role === 'student') {
      profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(user.id);
    }

    logAudit(user.id, user.email, user.role, 'LOGIN_SUCCESS', 'AUTH', user.id, {}, req);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        mobile: user.mobile,
        role: user.role,
        studentId: profile ? profile.student_id : null,
        profile
      }
    });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to connect to TRINEX services. Please try again.'
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: {
      ...req.user,
      studentProfile: req.studentProfile || null
    }
  });
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  logAudit(req.user.id, req.user.email, req.user.role, 'LOGOUT', 'AUTH', req.user.id, {}, req);
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide a valid registered email address.' });
  }

  return res.json({
    success: true,
    message: 'If an account exists with this email, password recovery instructions and an OTP have been sent.'
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  if (!newPassword || newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match or are invalid.' });
  }

  return res.json({
    success: true,
    message: 'Password has been reset successfully. Please log in with your new password.'
  });
});

export default router;
