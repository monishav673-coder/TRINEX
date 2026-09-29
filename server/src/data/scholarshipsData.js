// Official Schemes data for TRINEX (Sourced from Ministry of Tribal Affairs official guidelines)
export const initialScholarships = [
  {
    id: 'sch-pre-matric-01',
    code: 'PMS-ST-9-10',
    title: 'Pre-Matric Scholarship for ST Students',
    category: 'Pre-Matric Scholarship',
    description: 'Centrally sponsored scheme to support ST parents for education of their wards studying in classes IX and X so that the incidence of drop-out is minimized.',
    education_level: 'Class IX & X',
    max_amount: '₹3,500 - ₹7,000 / year + Ad-hoc Grant',
    eligibility_criteria_json: JSON.stringify({
      community: 'Scheduled Tribe (ST)',
      classes: ['Class 9', 'Class 10'],
      maxFamilyIncome: 250000,
      minAttendance: 75,
      otherScholarshipsAllowed: false,
      notes: 'Available for both day scholars and hostellers in recognized government/aided schools.'
    }),
    required_documents_json: JSON.stringify([
      'ST Community Certificate',
      'Family Income Certificate (below ₹2.5 Lakhs)',
      'Previous Class Marksheet',
      'Aadhaar / Student Identity Document',
      'School Bonafide Certificate',
      'Bank Passbook Copy (Aadhaar Seeded)'
    ]),
    deadline: '2026-11-30',
    status: 'ACTIVE',
    icon_name: 'BookOpen'
  },
  {
    id: 'sch-post-matric-02',
    code: 'PMS-ST-POST',
    title: 'Post-Matric Scholarship for ST Students',
    category: 'Post-Matric Scholarship',
    description: 'Comprehensive financial assistance for ST students studying at post-matriculation or post-secondary stage to enable them to complete their higher education.',
    education_level: 'Higher Secondary, Diploma, UG, PG, Professional',
    max_amount: 'Full Tuition + Maintenance Allowance up to ₹13,500 / year',
    eligibility_criteria_json: JSON.stringify({
      community: 'Scheduled Tribe (ST)',
      classes: ['Class 11', 'Class 12', 'Diploma', 'Undergraduate', 'Postgraduate'],
      maxFamilyIncome: 250000,
      minAttendance: 75,
      notes: 'Covers mandatory non-refundable fees, study tours, thesis typing, and book allowances for degree/diploma courses.'
    }),
    required_documents_json: JSON.stringify([
      'ST Community Certificate',
      'Income Certificate (Issued by authorized Tehsildar / Revenue Authority)',
      'Class 10 / 12 Marksheet',
      'Current Course Admission / Fee Receipt',
      'Institution Bonafide Certificate',
      'Aadhaar / APAAR ID Proof',
      'Aadhaar-seeded Bank Account Document'
    ]),
    deadline: '2026-12-15',
    status: 'ACTIVE',
    icon_name: 'GraduationCap'
  },
  {
    id: 'sch-top-class-03',
    code: 'TCS-ST-PREMIER',
    title: 'National Scholarship for Higher Education of ST Students (Top Class)',
    category: 'Top Class Scholarship',
    description: 'Full financial support for ST students who have secured admission in premier identified institutions like IITs, NITs, IIMs, AIIMS, NLUs, and central universities.',
    education_level: 'Undergraduate / Postgraduate in Notified Premier Institutes',
    max_amount: 'Full Tuition Fee + Living Expense (₹3,000/mo) + Books (₹5,000/yr) + Computer Grant (₹45,000 one-time)',
    eligibility_criteria_json: JSON.stringify({
      community: 'Scheduled Tribe (ST)',
      institutions: 'Notified Premier Institutes (IIT, IIM, NIT, AIIMS, NLU, etc.)',
      maxFamilyIncome: 600000,
      totalSlots: 'Fresh slots allocated yearly by MoTA',
      notes: 'Scholarship continues until completion of the course subject to satisfactory academic performance.'
    }),
    required_documents_json: JSON.stringify([
      'ST Certificate',
      'Income Certificate (below ₹6.0 Lakhs)',
      'Entrance Exam Scorecard (JEE / CAT / NEET / CLAT)',
      'Admission Letter & Fee Breakdown from Premier Institute',
      'Aadhaar Document',
      'Bonafide Verification from Dean / Registrar'
    ]),
    deadline: '2026-10-31',
    status: 'ACTIVE',
    icon_name: 'Award'
  },
  {
    id: 'sch-fellowship-04',
    code: 'NFST-MPhil-PhD',
    title: 'National Fellowship for ST Students (NFST)',
    category: 'National Fellowship for ST Students (NFST)',
    description: 'Provides fellowships to ST students pursuing regular and full-time M.Phil. and Ph.D. degrees in Sciences, Humanities, Social Sciences and Engineering & Technology.',
    education_level: 'M.Phil / Ph.D. / Integrated Doctoral Programs',
    max_amount: 'JRF: ₹37,000/mo | SRF: ₹42,000/mo + HRA & Annual Contingency',
    eligibility_criteria_json: JSON.stringify({
      community: 'Scheduled Tribe (ST)',
      education: 'Postgraduate degree with qualifying UGC-NET / CSIR-NET / GATE score',
      maxFamilyIncome: 'No income ceiling restriction',
      slotsAvailable: '750 fellowships awarded annually',
      notes: 'Tenure is 5 years. Upgradation to SRF after 2 years upon assessment committee recommendation.'
    }),
    required_documents_json: JSON.stringify([
      'ST Community Certificate',
      'Postgraduate Degree Certificate & Consolidated Marksheets',
      'UGC-NET / CSIR-NET / GATE Qualified Scorecard',
      'Ph.D. Registration / Admission Letter with University Stamp',
      'Research Proposal Synopsis (Duly signed by Supervisor)',
      'Aadhaar Card'
    ]),
    deadline: '2026-11-15',
    status: 'ACTIVE',
    icon_name: 'Compass'
  },
  {
    id: 'sch-overseas-05',
    code: 'NOS-ST-GLOBAL',
    title: 'National Overseas Scholarship for ST Candidates (NOS)',
    category: 'National Overseas Scholarship (NOS)',
    description: 'Provides financial assistance to selected ST candidates for pursuing Master level courses, Ph.D. and Post-Doctoral research abroad in top-ranking global institutions.',
    education_level: 'Master’s & Ph.D. in QS Top 500 Global Universities',
    max_amount: 'Tuition Fees + Annual Maintenance Allowance (US $15,400 / £9,900) + Airfare & Visa Fees',
    eligibility_criteria_json: JSON.stringify({
      community: 'Scheduled Tribe (ST)',
      minGraduationPercentage: 55,
      maxFamilyIncome: 800000,
      ageLimit: 35,
      universityRequirement: 'Unconditional Offer from Top 500 QS-ranked Global University',
      notes: '20 slots per year reserved exclusively for Scheduled Tribe scholars.'
    }),
    required_documents_json: JSON.stringify([
      'ST Community Certificate',
      'Income Certificate (below ₹8.0 Lakhs)',
      'Unconditional Offer Letter from QS Top 500 Institution',
      'Valid Passport Copy',
      'Undergraduate / Master’s Degree Certificates',
      'GRE / GMAT / IELTS / TOEFL Scorecard',
      'Statement of Purpose & Two Academic References'
    ]),
    deadline: '2026-12-31',
    status: 'ACTIVE',
    icon_name: 'Globe'
  }
];
