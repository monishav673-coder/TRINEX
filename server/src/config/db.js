import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initialScholarships } from '../data/scholarshipsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'trinex.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // Execute table definitions
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      student_id TEXT UNIQUE NOT NULL,
      dob TEXT,
      gender TEXT,
      state TEXT,
      district TEXT,
      institution TEXT,
      course TEXT,
      year_of_study TEXT,
      st_status TEXT DEFAULT 'Yes',
      pvtg_status TEXT DEFAULT 'No',
      family_income REAL DEFAULT 150000,
      disability_status TEXT DEFAULT 'No',
      domicile_state TEXT,
      net_jrf_status TEXT DEFAULT 'None',
      academic_percentage REAL DEFAULT 82.5,
      profile_completion INTEGER DEFAULT 85,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scholarships (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      education_level TEXT NOT NULL,
      max_amount TEXT NOT NULL,
      eligibility_criteria_json TEXT NOT NULL,
      required_documents_json TEXT NOT NULL,
      deadline TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      icon_name TEXT DEFAULT 'Award',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      application_no TEXT UNIQUE NOT NULL,
      student_id TEXT NOT NULL,
      scholarship_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Submitted',
      submission_date TEXT NOT NULL,
      academic_year TEXT DEFAULT '2026-2027',
      data_json TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (scholarship_id) REFERENCES scholarships(id)
    );

    CREATE TABLE IF NOT EXISTS application_status_history (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      updated_by TEXT DEFAULT 'System',
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      application_id TEXT,
      document_type TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_size TEXT,
      mime_type TEXT,
      verification_status TEXT DEFAULT 'Pending',
      expiry_date TEXT,
      uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS verification_records (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      service_name TEXT NOT NULL,
      status TEXT NOT NULL,
      details_json TEXT,
      mismatch_reason TEXT,
      clarification_note TEXT,
      checked_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      application_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      scholarship_id TEXT NOT NULL,
      sanctioned_amount REAL NOT NULL,
      disbursed_amount REAL NOT NULL DEFAULT 0,
      pending_amount REAL NOT NULL DEFAULT 0,
      payment_status TEXT NOT NULL DEFAULT 'Processing',
      transaction_ref TEXT,
      bank_account_masked TEXT DEFAULT 'XXXX-XXXX-4821',
      ifsc_code_masked TEXT DEFAULT 'SBIN000XXXX',
      payment_timeline_json TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (scholarship_id) REFERENCES scholarships(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'INFO',
      action_url TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_email TEXT,
      user_role TEXT,
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_id TEXT,
      ip_address TEXT DEFAULT '127.0.0.1',
      details_json TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS officer_reviews (
      id TEXT PRIMARY KEY,
      officer_id TEXT NOT NULL,
      application_id TEXT NOT NULL,
      action_taken TEXT NOT NULL,
      comments TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (officer_id) REFERENCES users(id),
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS beneficiary_outreach (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      institution TEXT NOT NULL,
      potential_scheme TEXT NOT NULL,
      contact_masked TEXT NOT NULL,
      matching_confidence INTEGER DEFAULT 88,
      outreach_status TEXT DEFAULT 'Requires Review',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data if empty
  seedDatabase();
}

function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return;

  console.log('[TRINEX DB] Seeding initial demo data...');

  const studentPassHash = bcrypt.hashSync('DemoStudent@123', 10);
  const officerPassHash = bcrypt.hashSync('DemoOfficer@123', 10);

  // 1. Seed Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, mobile, role, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const studentUserId = 'usr-st-ananya-10024';
  const officerUserId = 'usr-off-rajesh-9001';

  insertUser.run(studentUserId, 'student@trinex.demo', studentPassHash, 'Ananya Kumar', '+91 98765 43210', 'student', 1, '2026-09-01 09:00:00');
  insertUser.run(officerUserId, 'officer@trinex.demo', officerPassHash, 'Dr. Rajesh Verma', '+91 98111 22334', 'officer', 1, '2026-09-01 09:00:00');

  // 2. Seed Student Profile
  const profileId = 'prof-ananya-10024';
  db.prepare(`
    INSERT INTO student_profiles (
      id, user_id, student_id, dob, gender, state, district,
      institution, course, year_of_study, st_status, pvtg_status,
      family_income, disability_status, domicile_state, net_jrf_status,
      academic_percentage, profile_completion, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    profileId,
    studentUserId,
    'TRX-ST-10024',
    '2004-05-14',
    'Female',
    'Odisha',
    'Mayurbhanj',
    'Government Autonomous College, Rourkela',
    'Bachelor of Technology in Computer Science',
    '3rd Year',
    'Yes',
    'No',
    150000,
    'No',
    'Odisha',
    'None',
    84.5,
    85,
    '2026-09-01 09:10:00'
  );

  // 3. Seed Scholarships
  const insertScholarship = db.prepare(`
    INSERT INTO scholarships (id, code, title, category, description, education_level, max_amount, eligibility_criteria_json, required_documents_json, deadline, status, icon_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const sch of initialScholarships) {
    insertScholarship.run(
      sch.id,
      sch.code,
      sch.title,
      sch.category,
      sch.description,
      sch.education_level,
      sch.max_amount,
      sch.eligibility_criteria_json,
      sch.required_documents_json,
      sch.deadline,
      sch.status,
      sch.icon_name
    );
  }

  // 4. Seed Applications for Ananya
  const appId1 = 'app-trx-2026-00184';
  const postMatricSchId = 'sch-post-matric-02';

  db.prepare(`
    INSERT INTO applications (id, application_no, student_id, scholarship_id, status, submission_date, academic_year, data_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    appId1,
    'TRX-2026-00184',
    profileId,
    postMatricSchId,
    'Department Verification',
    '28 Sep 2026',
    '2026-2027',
    JSON.stringify({
      course: 'B.Tech in Computer Science',
      institution: 'Government Autonomous College, Rourkela',
      annualFees: 38000,
      hosteller: 'Yes',
      incomeDeclared: 150000
    }),
    '2026-09-28 10:00:00'
  );

  // Additional demo application for statistics
  db.prepare(`
    INSERT INTO applications (id, application_no, student_id, scholarship_id, status, submission_date, academic_year, data_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'app-trx-2025-00042',
    'TRX-2025-00042',
    profileId,
    'sch-pre-matric-01',
    'Completed',
    '15 Aug 2025',
    '2025-2026',
    JSON.stringify({ course: 'Class 10 High School', institution: 'Eklavya Model Residential School' }),
    '2025-08-15 10:00:00'
  );

  db.prepare(`
    INSERT INTO applications (id, application_no, student_id, scholarship_id, status, submission_date, academic_year, data_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'app-trx-2026-00219',
    'TRX-2026-00219',
    profileId,
    'sch-top-class-03',
    'Action Required',
    '20 Sep 2026',
    '2026-2027',
    JSON.stringify({ course: 'B.Tech Premier Stream', institution: 'NIT Rourkela Nodal' }),
    '2026-09-20 14:30:00'
  );

  // 5. Seed Status History
  const insertHistory = db.prepare(`
    INSERT INTO application_status_history (id, application_id, status, notes, updated_by, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertHistory.run('hist-1', appId1, 'Submitted', 'Application submitted online by student.', 'Ananya Kumar', '2026-09-28 10:00:00');
  insertHistory.run('hist-2', appId1, 'Document Verification', 'Digital certificates verified via DigiVault sandbox.', 'VeriCore Engine', '2026-09-28 10:15:00');
  insertHistory.run('hist-3', appId1, 'Institution Verification', 'Verified by Principal & Registrar with attendance record (88%).', 'Nodal Officer, Govt College', '2026-09-29 11:30:00');
  insertHistory.run('hist-4', appId1, 'Department Verification', 'Under scrutiny at District Tribal Welfare Office.', 'Officer Desk - Mayurbhanj', '2026-09-29 14:00:00');

  // 6. Seed DigiVault Documents
  const insertDoc = db.prepare(`
    INSERT INTO documents (id, student_id, application_id, document_type, file_name, file_url, file_size, mime_type, verification_status, expiry_date, uploaded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertDoc.run('doc-01', profileId, appId1, 'Identity Document', 'Aadhaar_Masked_Sample.pdf', '/sample-docs/aadhaar_sample.pdf', '1.2 MB', 'application/pdf', 'Verified', '2030-12-31', '2026-09-10 12:00:00');
  insertDoc.run('doc-02', profileId, appId1, 'ST Certificate', 'ST_Community_Cert_Mayurbhanj.pdf', '/sample-docs/st_cert.pdf', '2.1 MB', 'application/pdf', 'Verified', 'Lifetime', '2026-09-10 12:05:00');
  insertDoc.run('doc-03', profileId, appId1, 'Income Certificate', 'Revenue_Income_Cert_2026.pdf', '/sample-docs/income_cert.pdf', '1.8 MB', 'application/pdf', 'Mismatch', '2027-03-31', '2026-09-28 09:30:00');
  insertDoc.run('doc-04', profileId, appId1, 'Domicile Certificate', 'Odisha_Domicile_Record.pdf', '/sample-docs/domicile.pdf', '1.4 MB', 'application/pdf', 'Verified', 'Lifetime', '2026-09-10 12:10:00');
  insertDoc.run('doc-05', profileId, appId1, 'Marksheet', 'BTech_Sem4_Consolidated_Marksheet.pdf', '/sample-docs/marksheet.pdf', '3.0 MB', 'application/pdf', 'Verified', 'N/A', '2026-09-15 16:20:00');
  insertDoc.run('doc-06', profileId, appId1, 'Institution Certificate', 'Bonafide_Enrollment_GovtCollege.pdf', '/sample-docs/bonafide.pdf', '950 KB', 'application/pdf', 'Verified', '2027-06-30', '2026-09-25 11:00:00');

  // 7. Seed VeriCore Verification Records
  const insertVeri = db.prepare(`
    INSERT INTO verification_records (id, application_id, service_name, status, details_json, mismatch_reason, clarification_note, checked_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertVeri.run('veri-01', appId1, 'DigiLocker', 'MATCHED', JSON.stringify({ verifiedFields: ['ST Certificate', 'Domicile'], issuer: 'Govt of Odisha e-District' }), null, null, '2026-09-28 10:10:00');
  insertVeri.run('veri-02', appId1, 'UDISE+', 'MATCHED', JSON.stringify({ schoolCode: '21070100234', recordStatus: 'Verified Active' }), null, null, '2026-09-28 10:12:00');
  insertVeri.run('veri-03', appId1, 'APAAR', 'MATCHED', JSON.stringify({ apaarId: '9845-2011-8842', studentMatch: '100%' }), null, null, '2026-09-28 10:13:00');
  insertVeri.run('veri-04', appId1, 'AISHE', 'MATCHED', JSON.stringify({ aisheCode: 'C-39482', instituteType: 'Govt Autonomous College' }), null, null, '2026-09-28 10:14:00');
  insertVeri.run('veri-05', appId1, 'State e-District', 'MISMATCH', JSON.stringify({ portalName: 'Odisha Revenue e-Services', recordedIncome: '₹1,50,000', uploadedIncomeSlip: '₹1,80,000 (Gross family)' }), 'Income certificate value discrepancy detected between gross and net declaration. Routed to Manual Review.', null, '2026-09-28 10:15:00');
  insertVeri.run('veri-06', appId1, 'UGC / NTA', 'MATCHED', JSON.stringify({ entranceId: 'JEE-MAIN-2023', scoreValidated: true }), null, null, '2026-09-28 10:16:00');
  insertVeri.run('veri-07', appId1, 'NSP', 'MATCHED', JSON.stringify({ deDuplicationCheck: 'Clear - No duplicate disbursement found' }), null, null, '2026-09-28 10:17:00');
  insertVeri.run('veri-08', appId1, 'SFMP', 'MATCHED', JSON.stringify({ treasuryBridge: 'Ready for Sanction DBT' }), null, null, '2026-09-28 10:18:00');
  insertVeri.run('veri-09', appId1, 'UIDAI', 'MATCHED', JSON.stringify({ authType: 'Demographic + OTP Mock Sandbox', status: 'Seeded with Bank Account' }), null, null, '2026-09-28 10:19:00');
  insertVeri.run('veri-10', appId1, 'NOS', 'MATCHED', JSON.stringify({ overseasClearance: 'Not applicable for domestic post-matric' }), null, null, '2026-09-28 10:20:00');

  // 8. Seed Payment Record
  db.prepare(`
    INSERT INTO payments (id, application_id, student_id, scholarship_id, sanctioned_amount, disbursed_amount, pending_amount, payment_status, transaction_ref, bank_account_masked, ifsc_code_masked, payment_timeline_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'pay-trx-2026-00184',
    appId1,
    profileId,
    postMatricSchId,
    38000,
    0,
    38000,
    'Processing',
    'TXN-DBT-94827104',
    'XXXX-XXXX-4821',
    'SBIN0001042',
    JSON.stringify([
      { stage: 'Sanctioned', status: 'COMPLETED', date: '29 Sep 2026', note: 'Sanction Order MOTA/ST/2026/0498 issued' },
      { stage: 'Processing', status: 'IN_PROGRESS', date: 'Current Stage', note: 'PFMS DBT Batch 8492 file generated' },
      { stage: 'Transferred', status: 'PENDING', date: 'Estimated 05 Oct 2026', note: 'NPCI Aadhaar Payment Bridge clearing' },
      { stage: 'Completed', status: 'PENDING', date: 'Estimated 06 Oct 2026', note: 'Bank confirmation receipt' }
    ]),
    '2026-09-28 11:00:00'
  );

  // 9. Seed Notifications
  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, action_url, is_read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertNotif.run('notif-01', studentUserId, 'Application Submitted Successfully', 'Your application TRX-2026-00184 for Post-Matric Scholarship has been registered.', 'SUCCESS', '/applications/app-trx-2026-00184', 1, '2026-09-28 10:00:00');
  insertNotif.run('notif-02', studentUserId, 'Income Certificate Clarification', 'Income verification noted a slight discrepancy. Manual review is in progress; you may submit a clarifying note in VeriCore.', 'WARNING', '/vericore', 0, '2026-09-28 10:16:00');
  insertNotif.run('notif-03', studentUserId, 'Institution Verification Completed', 'Principal, Govt Autonomous College has approved your bonafide status with 88% attendance.', 'SUCCESS', '/applications/app-trx-2026-00184', 0, '2026-09-29 11:35:00');
  insertNotif.run('notif-04', studentUserId, 'Moved to Department Verification', 'Your application is now under final sanction review at the State Tribal Welfare Department.', 'INFO', '/applications/app-trx-2026-00184', 0, '2026-09-29 14:05:00');
  insertNotif.run('notif-05', studentUserId, 'Scholarship Payment Processing Started', 'PFMS batch DBT-94827104 initiated for ₹38,000 to your Aadhaar seeded account.', 'PAYMENT', '/fundtrack', 0, '2026-09-29 14:30:00');

  // 10. Seed Audit Logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, user_id, user_email, user_role, action, resource_type, resource_id, ip_address, details_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAudit.run('audit-01', studentUserId, 'student@trinex.demo', 'student', 'LOGIN_SUCCESS', 'AUTH', studentUserId, '127.0.0.1', '{"device": "Chrome Windows"}', '2026-09-28 09:50:00');
  insertAudit.run('audit-02', studentUserId, 'student@trinex.demo', 'student', 'SUBMIT_APPLICATION', 'APPLICATION', appId1, '127.0.0.1', '{"scheme": "Post-Matric Scholarship"}', '2026-09-28 10:00:00');
  insertAudit.run('audit-03', officerUserId, 'officer@trinex.demo', 'officer', 'VIEW_MANUAL_REVIEW', 'VERIFICATION', appId1, '127.0.0.1', '{"mismatchType": "Income"}', '2026-09-28 11:30:00');

  // 11. Seed Beneficiary Outreach Insight Records
  const insertBeneficiary = db.prepare(`
    INSERT INTO beneficiary_outreach (id, student_name, state, district, institution, potential_scheme, contact_masked, matching_confidence, outreach_status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBeneficiary.run('ben-01', 'Rahul Soren', 'Jharkhand', 'Dumka', 'Santhal Pargana College', 'Post-Matric Scholarship for ST', '+91 9431X-XXXX8', 94, 'Potentially Unreached', '2026-09-25 10:00:00');
  insertBeneficiary.run('ben-02', 'Sunita Murmu', 'Odisha', 'Koraput', 'Vikram Dev University', 'National Fellowship for ST Students (NFST)', '+91 9861X-XXXX2', 91, 'Requires Review', '2026-09-26 11:20:00');
  insertBeneficiary.run('ben-03', 'Birsa Munda', 'Chhattisgarh', 'Bastar', 'Govt Polytechnic Jagdalpur', 'Top Class Scholarship for ST', '+91 7710X-XXXX5', 88, 'Outreach Sent', '2026-09-27 15:40:00');
  insertBeneficiary.run('ben-04', 'Kavita Marandi', 'Madhya Pradesh', 'Jhabua', 'Govt PG College Jhabua', 'Post-Matric Scholarship for ST', '+91 9926X-XXXX1', 86, 'Potentially Unreached', '2026-09-28 09:15:00');

  console.log('[TRINEX DB] Demo database seeding complete.');
}
