-- TRINEX Database Relational Schema (PostgreSQL Compatible)

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'student', -- 'student', 'officer', 'admin'
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL,
    student_id VARCHAR(64) UNIQUE NOT NULL,
    dob VARCHAR(32),
    gender VARCHAR(32),
    state VARCHAR(128),
    district VARCHAR(128),
    institution VARCHAR(255),
    course VARCHAR(255),
    year_of_study VARCHAR(64),
    st_status VARCHAR(32) DEFAULT 'Yes',
    pvtg_status VARCHAR(32) DEFAULT 'No',
    family_income NUMERIC DEFAULT 150000,
    disability_status VARCHAR(32) DEFAULT 'No',
    domicile_state VARCHAR(128),
    net_jrf_status VARCHAR(64) DEFAULT 'None',
    academic_percentage NUMERIC DEFAULT 82.5,
    profile_completion INTEGER DEFAULT 85,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scholarships (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    education_level VARCHAR(128) NOT NULL,
    max_amount VARCHAR(128) NOT NULL,
    eligibility_criteria_json TEXT NOT NULL,
    required_documents_json TEXT NOT NULL,
    deadline VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'ACTIVE', -- 'ACTIVE', 'UPCOMING', 'CLOSED'
    icon_name VARCHAR(64) DEFAULT 'Award',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY,
    application_no VARCHAR(64) UNIQUE NOT NULL,
    student_id VARCHAR(64) NOT NULL,
    scholarship_id VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'Submitted',
    -- Statuses: 'Submitted', 'Document Verification', 'Institution Verification', 'Department Verification', 'Manual Review Required', 'Sanctioned', 'Disbursement', 'Completed', 'Clarification Required'
    submission_date VARCHAR(64) NOT NULL,
    academic_year VARCHAR(32) DEFAULT '2026-2027',
    data_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id)
);

CREATE TABLE IF NOT EXISTS application_status_history (
    id VARCHAR(64) PRIMARY KEY,
    application_id VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL,
    notes TEXT,
    updated_by VARCHAR(128) DEFAULT 'System',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL,
    application_id VARCHAR(64),
    document_type VARCHAR(128) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size VARCHAR(64),
    mime_type VARCHAR(64),
    verification_status VARCHAR(64) DEFAULT 'Pending', -- 'Uploaded', 'Verified', 'Pending', 'Mismatch', 'Expired'
    expiry_date VARCHAR(64),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS verification_records (
    id VARCHAR(64) PRIMARY KEY,
    application_id VARCHAR(64) NOT NULL,
    service_name VARCHAR(64) NOT NULL, -- 'DigiLocker', 'UDISE+', 'APAAR', 'AISHE', 'State e-District', 'UGC / NTA', 'NSP', 'SFMP', 'NOS', 'UIDAI'
    status VARCHAR(64) NOT NULL, -- 'MATCHED', 'MISMATCH', 'PENDING', 'VERIFIED_MANUAL'
    details_json TEXT,
    mismatch_reason TEXT,
    clarification_note TEXT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    application_id VARCHAR(64) NOT NULL,
    student_id VARCHAR(64) NOT NULL,
    scholarship_id VARCHAR(64) NOT NULL,
    sanctioned_amount NUMERIC NOT NULL,
    disbursed_amount NUMERIC NOT NULL DEFAULT 0,
    pending_amount NUMERIC NOT NULL DEFAULT 0,
    payment_status VARCHAR(64) NOT NULL DEFAULT 'Processing', -- 'Sanctioned', 'Processing', 'Transferred', 'Completed'
    transaction_ref VARCHAR(128),
    bank_account_masked VARCHAR(64) DEFAULT 'XXXX-XXXX-4821',
    ifsc_code_masked VARCHAR(64) DEFAULT 'SBIN000XXXX',
    payment_timeline_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(64) DEFAULT 'INFO', -- 'SUCCESS', 'WARNING', 'INFO', 'PAYMENT', 'ACTION'
    action_url VARCHAR(255),
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    user_email VARCHAR(255),
    user_role VARCHAR(64),
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(128) NOT NULL,
    resource_id VARCHAR(64),
    ip_address VARCHAR(64) DEFAULT '127.0.0.1',
    details_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS officer_reviews (
    id VARCHAR(64) PRIMARY KEY,
    officer_id VARCHAR(64) NOT NULL,
    application_id VARCHAR(64) NOT NULL,
    action_taken VARCHAR(64) NOT NULL, -- 'Request Clarification', 'Mark Verified', 'Return for Correction'
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (officer_id) REFERENCES users(id),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS beneficiary_outreach (
    id VARCHAR(64) PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    state VARCHAR(128) NOT NULL,
    district VARCHAR(128) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    potential_scheme VARCHAR(255) NOT NULL,
    contact_masked VARCHAR(64) NOT NULL,
    matching_confidence INTEGER DEFAULT 88,
    outreach_status VARCHAR(64) DEFAULT 'Requires Review', -- 'Potentially Unreached', 'Requires Review', 'Outreach Sent', 'Enrolled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
