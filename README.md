# TRINEX — Tribal Integrated Next-Generation Scholarship Ecosystem

> **Tagline:** *"One Platform. Every Scholarship. Smarter Access."*  
> **Environment Notice:** *Prototype / Demo Environment — Designed exclusively for Scheduled Tribe scholarship discovery, document verification, and DBT tracking.*

---

## 🏛️ Executive Overview

**TRINEX** is a unified digital scholarship platform engineered to empower Tribal (ST & PVTG) students across India. It solves the critical problem of fragmented state and central portals, repeated document submissions, delayed scrutiny, and uncertain payment disbursements by bringing the entire scholar journey into a single, cohesive, modern application.

### Key Innovations:
1. **One Platform:** Single-window discovery and application for 5 major central and state schemes.
2. **DigiVault:** A dedicated digital credential wallet supporting DigiLocker integration and 10 certificate types.
3. **VeriCore:** A unified verification center interfacing with 10 sandbox registries (DigiLocker, UDISE+, APAAR, AISHE, State e-District, UGC/NTA, NSP, SFMP, NOS, UIDAI).
4. **Zero Automatic Rejection Standard:** Automated mismatches are safely escalated to **Manual Review Required** for officer scrutiny.
5. **JAGO AI:** Context-aware assistant providing intelligent answers based on real application state and official Ministry guidelines in 6 regional languages.
6. **FundTrack:** Transparent tracking of financial sanctions, PFMS electronic batching, and DBT bank disbursements.
7. **Officer Command Center:** Multi-tier scrutiny queues, manual review resolution, and AI Beneficiary Insight matching unreached ST students.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS, React Router v6, Axios, Lucide React, Recharts.
- **Backend:** Node.js, Express.js (ESM), JWT authentication, bcrypt password hashing, Multer document handling, role-based authorization (RBAC).
- **Database:** Relational schema (PostgreSQL compatible) with zero-config SQLite persistence (`better-sqlite3`).
- **Language Support:** English, தமிழ் (Tamil), हिन्दी (Hindi), తెలుగు (Telugu), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam).

---

## 🔑 Fictional Demo Accounts

| Role | Email | Password | Name / Designation |
| :--- | :--- | :--- | :--- |
| **Student** | `student@trinex.demo` | `DemoStudent@123` | **Ananya Kumar** (ID: `TRX-ST-10024`) |
| **Officer** | `officer@trinex.demo` | `DemoOfficer@123` | **Dr. Rajesh Verma** (Welfare Scrutiny Desk) |

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Both Server & Client
```bash
# Backend runs on http://localhost:5000
# Frontend runs on http://localhost:5173
npm run dev
```

---

## 📊 Core Scholarship Schemes Supported

1. **Pre-Matric Scholarship for ST Students (Classes 9-10)**
2. **Post-Matric Scholarship for ST Students (Post-Secondary & Higher Education)**
3. **Top Class Education Scholarship (Premier Institutes: IIT, NIT, IIM, AIIMS, NLU)**
4. **National Fellowship for ST Students (NFST - M.Phil / Ph.D.)**
5. **National Overseas Scholarship (NOS - QS Top 500 Global Universities)**

---

## ⚖️ Disclaimer & Standards

All verification APIs (`/api/mock/*`), bank account details (`XXXX-XXXX-4821`), and identity documents are simulated prototype sandbox records. No real confidential government credentials or live citizen data are collected or transmitted.
