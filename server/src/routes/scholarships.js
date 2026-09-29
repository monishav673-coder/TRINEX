import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// GET /api/scholarships
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM scholarships WHERE 1=1';
    const params = [];

    if (category && category !== 'ALL') {
      query += ' AND category LIKE ?';
      params.push(`%${category}%`);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR education_level LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at ASC';
    const scholarships = db.prepare(query).all(...params);

    const parsed = scholarships.map(s => ({
      ...s,
      eligibilityCriteria: JSON.parse(s.eligibility_criteria_json || '{}'),
      requiredDocuments: JSON.parse(s.required_documents_json || '[]')
    }));

    return res.json({ success: true, count: parsed.length, scholarships: parsed });
  } catch (err) {
    console.error('[Scholarships GET Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve scholarships list.' });
  }
});

// GET /api/scholarships/:id
router.get('/:id', (req, res) => {
  try {
    const scholarship = db.prepare('SELECT * FROM scholarships WHERE id = ? OR code = ?').get(req.params.id, req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship scheme not found.' });
    }

    return res.json({
      success: true,
      scholarship: {
        ...scholarship,
        eligibilityCriteria: JSON.parse(scholarship.eligibility_criteria_json || '{}'),
        requiredDocuments: JSON.parse(scholarship.required_documents_json || '[]')
      }
    });
  } catch (err) {
    console.error('[Scholarship GET by ID Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve scholarship details.' });
  }
});

export default router;
