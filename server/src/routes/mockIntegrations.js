import express from 'express';

const router = express.Router();

const getMockHeader = (sourceName) => ({
  source: sourceName,
  environment: 'DEMO',
  checkedAt: new Date().toISOString(),
  prototypeNotice: 'Prototype / Sandbox API Response - Not Live Government Data'
});

// 1. DigiLocker
router.get('/digilocker', (req, res) => {
  res.json({
    ...getMockHeader('DigiLocker'),
    status: 'MATCHED',
    data: {
      accountStatus: 'Linked (Sandbox)',
      verifiedCertificates: [
        { type: 'ST Caste Certificate', docId: 'DL-ST-2024-9182', issuer: 'Revenue Dept, Odisha' },
        { type: 'Domicile Certificate', docId: 'DL-DOM-2023-4102', issuer: 'Tehsildar Office' }
      ]
    }
  });
});

// 2. UIDAI (Aadhaar Demographic Mock)
router.get('/uidai', (req, res) => {
  res.json({
    ...getMockHeader('UIDAI'),
    status: 'MATCHED',
    data: {
      authType: 'Demographic + Sandbox OTP',
      aadhaarMasked: 'XXXX-XXXX-4821',
      nameMatchScore: 99.4,
      dbtBankSeeded: true,
      bankName: 'State Bank of India (Masked Demo)'
    }
  });
});

// 3. UDISE+
router.get('/udise', (req, res) => {
  res.json({
    ...getMockHeader('UDISE+'),
    status: 'MATCHED',
    data: {
      schoolUdiseCode: '21070100234',
      schoolCategory: 'Government Higher Secondary',
      attendanceVerified: '88.5%',
      academicPassRecord: true
    }
  });
});

// 4. APAAR
router.get('/apaar', (req, res) => {
  res.json({
    ...getMockHeader('APAAR'),
    status: 'MATCHED',
    data: {
      apaarId: 'APAAR-9845-2011-8842',
      academicBankOfCredits: 'Active (44 Credits Earned)',
      identityValidation: '100% Match'
    }
  });
});

// 5. AISHE
router.get('/aishe', (req, res) => {
  res.json({
    ...getMockHeader('AISHE'),
    status: 'MATCHED',
    data: {
      aisheCode: 'C-39482',
      institutionName: 'Government Autonomous College, Rourkela',
      accreditation: 'NAAC Grade A',
      nodalOfficerDesignated: true
    }
  });
});

// 6. State e-District
router.get('/edistrict', (req, res) => {
  res.json({
    ...getMockHeader('State e-District'),
    status: 'MISMATCH',
    data: {
      portal: 'State Revenue & Land Records Portal',
      declaredFamilyIncome: '₹1,50,000',
      revenueRecordIncome: '₹1,80,000 (Gross Agricultural + Allied)',
      mismatchSeverity: 'Low (Within Scheme Limit of ₹2.5L)',
      action: 'Routed to Manual Review Required'
    }
  });
});

// 7. UGC / NTA
router.get('/ugcnta', (req, res) => {
  res.json({
    ...getMockHeader('UGC / NTA'),
    status: 'MATCHED',
    data: {
      examType: 'JEE-MAIN / UGC-NET Scorecard Sandbox',
      rollNoMasked: '2303XXXX819',
      scorePercentile: '91.82',
      categoryRankVerified: true
    }
  });
});

// 8. NSP (National Scholarship Portal)
router.get('/nsp', (req, res) => {
  res.json({
    ...getMockHeader('NSP'),
    status: 'MATCHED',
    data: {
      deDuplicationRegistry: 'Passed',
      previousScholarshipAvailed: 'Pre-Matric ST (Class 10)',
      noDualBenefitsConflict: true
    }
  });
});

// 9. SFMP (State Financial Management Portal)
router.get('/sfmp', (req, res) => {
  res.json({
    ...getMockHeader('SFMP'),
    status: 'MATCHED',
    data: {
      treasuryBatch: 'SFMP-DBT-2026-B09',
      budgetHead: '2225-Special Component for ST Welfare',
      clearingStatus: 'Ready for Bank Dispatch'
    }
  });
});

// 10. NOS (National Overseas Portal)
router.get('/nos', (req, res) => {
  res.json({
    ...getMockHeader('NOS'),
    status: 'MATCHED',
    data: {
      overseasRegistry: 'Domestic Post-Matric Stream (NOS not invoked)',
      statusNote: 'Eligible for future overseas master/doctoral applications'
    }
  });
});

export default router;
