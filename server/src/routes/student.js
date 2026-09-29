import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { logAudit } from '../middleware/auditMiddleware.js';

const router = express.Router();

// GET /api/student/profile
router.get('/profile', authenticateToken, authorizeRoles('student'), (req, res) => {
  try {
    const profile = db.prepare(`
      SELECT sp.*, u.full_name, u.email, u.mobile, u.role
      FROM student_profiles sp
      JOIN users u ON u.id = sp.user_id
      WHERE sp.user_id = ?
    `).get(req.user.id);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    return res.json({ success: true, profile });
  } catch (err) {
    console.error('[Student Profile GET Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch student profile.' });
  }
});

// PUT /api/student/profile
router.put('/profile', authenticateToken, authorizeRoles('student'), (req, res) => {
  try {
    const {
      dob, gender, state, district, institution, course,
      yearOfStudy, stStatus, pvtgStatus, familyIncome, disabilityStatus,
      domicileState, netJrfStatus, academicPercentage
    } = req.body;

    // Calculate profile completion percentage
    let score = 30; // base from registration
    if (dob && gender) score += 10;
    if (state && district) score += 10;
    if (institution && course) score += 15;
    if (stStatus === 'Yes') score += 10;
    if (familyIncome) score += 10;
    if (academicPercentage) score += 10;

    const completion = Math.min(100, score);

    db.prepare(`
      UPDATE student_profiles SET
        dob = COALESCE(?, dob),
        gender = COALESCE(?, gender),
        state = COALESCE(?, state),
        district = COALESCE(?, district),
        institution = COALESCE(?, institution),
        course = COALESCE(?, course),
        year_of_study = COALESCE(?, year_of_study),
        st_status = COALESCE(?, st_status),
        pvtg_status = COALESCE(?, pvtg_status),
        family_income = COALESCE(?, family_income),
        disability_status = COALESCE(?, disability_status),
        domicile_state = COALESCE(?, domicile_state),
        net_jrf_status = COALESCE(?, net_jrf_status),
        academic_percentage = COALESCE(?, academic_percentage),
        profile_completion = ?,
        updated_at = datetime('now')
      WHERE user_id = ?
    `).run(
      dob || null, gender || null, state || null, district || null,
      institution || null, course || null, yearOfStudy || null,
      stStatus || null, pvtgStatus || null, familyIncome ? Number(familyIncome) : null,
      disabilityStatus || null, domicileState || null, netJrfStatus || null,
      academicPercentage ? Number(academicPercentage) : null,
      completion,
      req.user.id
    );

    const updatedProfile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
    logAudit(req.user.id, req.user.email, 'student', 'UPDATE_PROFILE', 'STUDENT_PROFILE', updatedProfile.id, { completion }, req);

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updatedProfile
    });
  } catch (err) {
    console.error('[Student Profile PUT Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

export default router;
