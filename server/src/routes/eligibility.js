import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

// POST /api/eligibility/check
router.post('/check', (req, res) => {
  try {
    const {
      educationLevel,
      course,
      year,
      institutionType,
      stStatus,
      pvtgStatus,
      familyIncome,
      academicPerformance,
      disabilityStatus,
      netJrfStatus,
      overseasStudy,
      currentScholarshipStatus
    } = req.body;

    const income = Number(familyIncome) || 0;
    const academicPct = Number(academicPerformance) || 0;
    const isST = stStatus === 'Yes' || stStatus === true;
    const isOverseas = overseasStudy === 'Yes' || overseasStudy === true;
    const hasNetJrf = netJrfStatus && netJrfStatus !== 'None';

    const matchedSchemes = [];

    // 1. Check Pre-Matric
    if (isST && (educationLevel === 'Class 9' || educationLevel === 'Class 10')) {
      const incomeOk = income <= 250000;
      matchedSchemes.push({
        schemeId: 'sch-pre-matric-01',
        schemeCode: 'PMS-ST-9-10',
        schemeTitle: 'Pre-Matric Scholarship for ST Students',
        status: incomeOk ? 'Potentially Eligible' : 'Requires Review',
        confidence: incomeOk ? 95 : 60,
        matchedCriteria: [
          'Scheduled Tribe (ST) verified status',
          'Enrolled in Secondary Education (Class 9-10)',
          incomeOk ? `Family income (₹${income.toLocaleString()}) within ceiling of ₹2.5 Lakhs` : 'Income exceeds standard ceiling'
        ],
        missingInformation: [],
        requiredDocuments: ['ST Certificate', 'Income Certificate', 'Class 8/9 Marksheet', 'School Bonafide', 'Bank Passbook'],
        importantNotes: 'Applicable for both Day Scholars and Hostellers in government and aided schools.'
      });
    }

    // 2. Check Post-Matric
    if (isST && ['Class 11', 'Class 12', 'Diploma', 'Undergraduate', 'Postgraduate', 'Professional'].includes(educationLevel)) {
      const incomeOk = income <= 250000;
      matchedSchemes.push({
        schemeId: 'sch-post-matric-02',
        schemeCode: 'PMS-ST-POST',
        schemeTitle: 'Post-Matric Scholarship for ST Students',
        status: incomeOk ? 'Potentially Eligible' : 'Requires Review',
        confidence: incomeOk ? 92 : 65,
        matchedCriteria: [
          'Scheduled Tribe (ST) community status',
          'Pursuing post-matriculation higher education',
          incomeOk ? `Family income (₹${income.toLocaleString()}) meets guideline ceiling of ₹2.50 Lakhs` : 'Family income requires certificate validation'
        ],
        missingInformation: !course ? ['Specific Degree / Course name'] : [],
        requiredDocuments: ['ST Certificate', 'Income Certificate', 'Previous Marksheet', 'Bonafide / Admission Fee Receipt', 'Aadhaar-seeded Bank Account'],
        importantNotes: 'Includes full compulsory non-refundable fees plus annual maintenance allowance.'
      });
    }

    // 3. Check Top Class Scholarship
    if (isST && institutionType === 'Premier / National Institute (IIT, NIT, IIM, AIIMS, NLU)') {
      const incomeOk = income <= 600000;
      matchedSchemes.push({
        schemeId: 'sch-top-class-03',
        schemeCode: 'TCS-ST-PREMIER',
        schemeTitle: 'National Scholarship for Higher Education of ST Students (Top Class)',
        status: incomeOk ? 'Potentially Eligible' : 'Requires Review',
        confidence: incomeOk ? 90 : 70,
        matchedCriteria: [
          'ST Student admitted in premier notified institution',
          incomeOk ? `Income (₹${income.toLocaleString()}) within premier scheme limit of ₹6.0 Lakhs` : 'Income ceiling review needed'
        ],
        missingInformation: [],
        requiredDocuments: ['ST Certificate', 'Income Certificate (<₹6L)', 'Entrance Scorecard (JEE/CAT/NEET/CLAT)', 'Institute Admission Letter & Fee Structure'],
        importantNotes: 'Covers full tuition fees, living allowance ₹3,000/mo, book grant ₹5,000/yr, and one-time ₹45,000 computer grant.'
      });
    }

    // 4. Check NFST (National Fellowship for ST Students)
    if (isST && (educationLevel === 'Ph.D.' || educationLevel === 'M.Phil / Doctoral' || hasNetJrf)) {
      matchedSchemes.push({
        schemeId: 'sch-fellowship-04',
        schemeCode: 'NFST-MPhil-PhD',
        schemeTitle: 'National Fellowship for ST Students (NFST)',
        status: 'Potentially Eligible',
        confidence: 88,
        matchedCriteria: [
          'Scheduled Tribe doctoral scholar',
          hasNetJrf ? `Qualified ${netJrfStatus} National Eligibility Test` : 'Postgraduate qualification indicated',
          'No family income ceiling restriction applies for NFST'
        ],
        missingInformation: !hasNetJrf ? ['UGC/CSIR NET/GATE score verification'] : [],
        requiredDocuments: ['ST Certificate', 'PG Consolidated Marksheets & Degree', 'NET/JRF Scorecard', 'Ph.D. Registration / Admission Letter', 'Research Proposal Synopsis'],
        importantNotes: 'Provides monthly fellowship of ₹37,000 (JRF) / ₹42,000 (SRF) + HRA and contingency grants.'
      });
    }

    // 5. Check NOS (National Overseas Scholarship)
    if (isST && (isOverseas || educationLevel === 'International Studies')) {
      const incomeOk = income <= 800000;
      const academicOk = academicPct >= 55;
      matchedSchemes.push({
        schemeId: 'sch-overseas-05',
        schemeCode: 'NOS-ST-GLOBAL',
        schemeTitle: 'National Overseas Scholarship for ST Candidates (NOS)',
        status: incomeOk && academicOk ? 'Potentially Eligible' : 'Requires Review',
        confidence: incomeOk && academicOk ? 89 : 60,
        matchedCriteria: [
          'Scheduled Tribe applicant seeking global Master’s/Ph.D.',
          incomeOk ? `Income (₹${income.toLocaleString()}) within global quota ceiling of ₹8.0 Lakhs` : 'Income verification required',
          academicOk ? `Academic score (${academicPct}%) satisfies minimum 55% criteria` : 'Qualifying graduation score needed'
        ],
        missingInformation: ['Unconditional Offer Letter from QS Top 500 University', 'Valid Indian Passport'],
        requiredDocuments: ['ST Certificate', 'Income Certificate (<₹8L)', 'Passport Copy', 'Unconditional Offer Letter', 'GRE/IELTS/TOEFL Scorecard'],
        importantNotes: '20 designated ST slots per year. Fully funded overseas tuition + annual maintenance allowance.'
      });
    }

    // Fallback: If no direct specific scheme matched yet, provide Post-Matric or Pre-Matric potential match
    if (matchedSchemes.length === 0 && isST) {
      matchedSchemes.push({
        schemeId: 'sch-post-matric-02',
        schemeCode: 'PMS-ST-POST',
        schemeTitle: 'Post-Matric Scholarship for ST Students',
        status: 'Potentially Eligible',
        confidence: 78,
        matchedCriteria: [
          'Scheduled Tribe (ST) demographic status',
          'Higher education enrollment profile'
        ],
        missingInformation: ['Specific institute AISHE code validation'],
        requiredDocuments: ['ST Certificate', 'Income Certificate', 'Fee Receipt', 'Bonafide Certificate'],
        importantNotes: 'Final eligibility is subject to official scheme guidelines and verification.'
      });
    }

    return res.json({
      success: true,
      resultText: matchedSchemes.length > 0 ? 'Potentially Eligible' : 'Inconclusive Profile',
      disclaimer: 'Final eligibility is subject to official scheme guidelines and verification. Automated mismatches are directed to manual review.',
      matchedCount: matchedSchemes.length,
      recommendations: matchedSchemes
    });
  } catch (err) {
    console.error('[Eligibility Check Error]', err);
    return res.status(500).json({ success: false, message: 'Eligibility calculation service error.' });
  }
});

export default router;
