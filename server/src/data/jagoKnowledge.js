// JAGO AI - Controlled Scholarship Knowledge Base & Verification Rules
export const jagoKnowledgeBase = {
  schemes: [
    {
      name: 'Pre-Matric Scholarship for ST Students',
      shortCode: 'PMS-ST-9-10',
      description: 'Centrally sponsored scheme for ST students studying in classes 9 and 10 in recognized schools.',
      incomeLimit: '₹2,50,000 per annum',
      targetLevel: 'Class IX & X',
      benefits: 'Day Scholars: ₹3,500/year; Hostellers: ₹7,000/year + ₹1,000 ad-hoc book grant.',
      documents: ['ST Certificate', 'Income Certificate', 'Previous Marksheet', 'School Bonafide', 'Bank Passbook copy (Aadhaar linked)'],
      source: 'Ministry of Tribal Affairs Official Pre-Matric ST Scheme Guidelines'
    },
    {
      name: 'Post-Matric Scholarship for ST Students',
      shortCode: 'PMS-ST-POST',
      description: 'Financial assistance for ST students enrolled in post-matriculation courses (Class 11, 12, Diploma, ITI, UG, PG, Doctorate).',
      incomeLimit: '₹2,50,000 per annum',
      targetLevel: 'Class 11 to Ph.D.',
      benefits: 'Compulsory non-refundable tuition fee coverage + maintenance allowance up to ₹13,500/yr for hostellers.',
      documents: ['ST Certificate', 'Income Certificate by Tehsildar', 'Class 10/12 Marksheets', 'College Admission Fee Receipt', 'Bonafide Certificate', 'Aadhaar / APAAR Card'],
      source: 'Ministry of Tribal Affairs Post-Matric ST Guidelines'
    },
    {
      name: 'Top Class Scholarship for ST Students',
      shortCode: 'TCS-ST-PREMIER',
      description: 'Full financial support for ST students in premier institutions (IITs, NITs, IIMs, AIIMS, NLUs, etc.).',
      incomeLimit: '₹6,00,000 per annum',
      targetLevel: 'Undergraduate and Postgraduate at Notified Premier Institutes',
      benefits: 'Full tuition fee + living allowance ₹3,000/month + book grant ₹5,000/year + one-time computer grant ₹45,000.',
      documents: ['ST Certificate', 'Income Certificate (<₹6L)', 'Premier Institute Admission Letter & Fee Structure', 'Entrance Exam Scorecard', 'Aadhaar Card'],
      source: 'Ministry of Tribal Affairs Top Class Education Guidelines'
    },
    {
      name: 'National Fellowship for ST Students (NFST)',
      shortCode: 'NFST-MPhil-PhD',
      description: 'Fellowships for ST scholars pursuing full-time M.Phil. and Ph.D. degrees across Indian Universities.',
      incomeLimit: 'No income ceiling restriction',
      targetLevel: 'M.Phil / Ph.D. programs',
      benefits: 'JRF: ₹37,000/mo; SRF: ₹42,000/mo + HRA as per city tier + annual contingency grants.',
      documents: ['ST Certificate', 'Postgraduate Degree Certificate & Marksheets', 'UGC-NET / CSIR-NET / GATE Scorecard', 'Ph.D. Admission / Registration Letter', 'Research Proposal Synopsis'],
      source: 'Ministry of Tribal Affairs NFST Guidelines'
    },
    {
      name: 'National Overseas Scholarship for ST Candidates (NOS)',
      shortCode: 'NOS-ST-GLOBAL',
      description: 'Prestigious scholarship for ST scholars pursuing Master’s and Ph.D. in QS Top 500 Global Universities.',
      incomeLimit: '₹8,00,000 per annum',
      targetLevel: 'International Master’s / Ph.D.',
      benefits: 'Full tuition fees + annual living allowance ($15,400 / £9,900) + economy airfare + medical insurance and visa fees.',
      documents: ['ST Certificate', 'Income Certificate (<₹8L)', 'Unconditional Offer Letter (QS Top 500)', 'Valid Passport', 'Degree Certificates', 'IELTS / TOEFL / GRE Scorecard'],
      source: 'Ministry of Tribal Affairs NOS Guidelines'
    }
  ],

  statusExplanations: {
    'Submitted': 'Your application has been received into the TRINEX central registry. It is queued for automated initial document checks.',
    'Document Verification': 'Your uploaded digital certificates (ST, Income, Domicile, Marksheets) are undergoing automated validation with VeriCore sandbox services.',
    'Institution Verification': 'Your educational institution (Nodal Officer) is verifying your active student enrollment, attendance percentage, and fee structure.',
    'Department Verification': 'The State Tribal Welfare Department or Central Ministry is scrutinizing your application record for sanction approval.',
    'Manual Review Required': 'A data difference or mismatch was detected during automated verification. An authorized welfare officer has been assigned to manually inspect your record without automatic rejection.',
    'Clarification Required': 'An officer has requested supplementary documents or a clarification statement regarding an uploaded certificate.',
    'Sanctioned': 'Your scholarship has received financial sanction approval from the competent authority. The sanction order has been generated.',
    'Disbursement': 'Payment instructions have been forwarded to Public Financial Management System (PFMS) / SFMP for Direct Benefit Transfer (DBT) to your Aadhaar-seeded bank account.',
    'Completed': 'Scholarship funds have been successfully credited to your bank account.'
  },

  paymentStages: {
    'Sanctioned': 'Fund amount approved and allocated under ministry budget head.',
    'Processing': 'DBT payment batch queued at payment gateway / SFMP / PFMS.',
    'Transferred': 'Direct credit request executed with NPCI Aadhaar payment bridge.',
    'Completed': 'Credit confirmed by beneficiary bank.'
  },

  faqs: [
    {
      q: 'What is TRINEX?',
      a: 'TRINEX (Tribal Integrated Next-Generation Scholarship Ecosystem) is a single unified digital window for Tribal students to discover scholarships, verify digital documents in DigiVault, track verification via VeriCore, and monitor direct benefit transfer payments.'
    },
    {
      q: 'What should I do if a mismatch is detected in my verification?',
      a: 'In TRINEX, automated mismatches are never automatically rejected. Your application is safely routed to the "Manual Review Required" queue where an authorized officer can review the context or ask for a simple clarification in your dashboard.'
    },
    {
      q: 'How does DigiVault help me?',
      a: 'DigiVault securely holds your verified educational and community documents in one place, allowing you to reuse them across multiple applications without re-uploading every year.'
    },
    {
      q: 'Do I need an Aadhaar-seeded bank account?',
      a: 'Yes. All government scholarship disbursements under DBT guidelines require your bank account to be linked and seeded with your Aadhaar number at your bank branch.'
    }
  ]
};
