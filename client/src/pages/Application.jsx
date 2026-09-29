import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { scholarshipService } from '../services/scholarshipService';
import { applicationService } from '../services/applicationService';
import { documentService } from '../services/documentService';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  User,
  GraduationCap,
  Users,
  Award,
  FolderLock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Upload,
  Sparkles,
  Calendar,
  Building
} from 'lucide-react';

export const Application = () => {
  const [searchParams] = useSearchParams();
  const preSelectedSchemeId = searchParams.get('scheme') || 'sch-post-matric-02';

  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [userDocs, setUserDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: user?.fullName || 'Ananya Kumar',
    dob: user?.profile?.dob || '2004-05-14',
    gender: user?.profile?.gender || 'Female',
    mobile: user?.mobile || '+91 98765 43210',
    email: user?.email || 'student@trinex.demo',
    aadhaarMasked: 'XXXX-XXXX-4821',

    // Step 2: Academic
    institution: user?.profile?.institution || 'Government Autonomous College, Rourkela',
    aisheCode: 'C-39482',
    course: user?.profile?.course || 'Bachelor of Technology in Computer Science',
    yearOfStudy: user?.profile?.year_of_study || '3rd Year',
    rollNumber: '2023-CS-084',
    academicPercentage: user?.profile?.academic_percentage || '84.5',

    // Step 3: Family & Income
    fatherName: 'Late Suresh Kumar',
    motherName: 'Sunita Kumar',
    stCommunity: 'Santhal / Scheduled Tribe (Odisha)',
    pvtgStatus: user?.profile?.pvtg_status || 'No',
    annualIncome: user?.profile?.family_income || '150000',
    incomeCertNumber: 'INC/OD/2026/94821',

    // Step 4: Scheme Specific
    dayScholarOrHosteller: 'Hosteller',
    annualTuitionFee: '38000',
    hostelMessFeeAnnual: '24000',
    otherScholarshipAvailed: 'No',

    // Step 5: Documents Selected
    selectedDocs: ['Identity Document', 'ST Certificate', 'Income Certificate', 'Domicile Certificate', 'Marksheet', 'Institution Certificate'],

    // Step 6: Verification Confirmation
    agreeToDirectVerification: true
  });

  useEffect(() => {
    loadInitial();
  }, []);

  const loadInitial = async () => {
    try {
      const sRes = await scholarshipService.getAll();
      if (sRes.success) {
        setSchemes(sRes.scholarships || []);
        const target = sRes.scholarships.find(s => s.id === preSelectedSchemeId) || sRes.scholarships[0];
        setSelectedScheme(target);
      }

      const dRes = await documentService.getAll();
      if (dRes.success) {
        setUserDocs(dRes.documents || []);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleNext = () => {
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await applicationService.create({
        scholarshipId: selectedScheme?.id || 'sch-post-matric-02',
        formData: formData,
        selectedDocuments: formData.selectedDocs
      });

      if (res.success) {
        setSubmissionResult(res);
        setCurrentStep(8); // Step 8: Success screen
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepList = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Academic' },
    { num: 3, label: 'Family & Income' },
    { num: 4, label: 'Scheme Details' },
    { num: 5, label: 'Documents' },
    { num: 6, label: 'VeriCore' },
    { num: 7, label: 'Preview' },
    { num: 8, label: 'Submit' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200">
            Unified Application Wizard
          </span>
          <span className="text-xs text-slate-500 font-medium">8-Step Guided Filing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          {selectedScheme ? selectedScheme.title : 'Scholarship Application'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Apply once with DigiVault credentials; your documents and verification will automatically route to nodal officers.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle overflow-x-auto">
        <div className="min-w-[600px] flex items-center justify-between">
          {stepList.map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === s.num
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : currentStep > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[10px] font-semibold mt-1 whitespace-nowrap ${
                  currentStep === s.num ? 'text-primary-700 font-bold' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>

              {idx < stepList.length - 1 && (
                <div
                  className={`w-10 sm:w-14 h-0.5 mx-1 transition-all ${
                    currentStep > s.num ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Step Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-primary-600" />
              <span>Step 1: Personal & Demographic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Aadhaar (Masked Sandbox)</label>
                <input
                  type="text"
                  name="aadhaarMasked"
                  value={formData.aadhaarMasked}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Information */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary-600" />
              <span>Step 2: Educational Enrollment Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">College / University Name</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">AISHE / UDISE Code</label>
                <input
                  type="text"
                  name="aisheCode"
                  value={formData.aisheCode}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course / Program</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Year of Study</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Qualifying Score (%)</label>
                <input
                  type="number"
                  name="academicPercentage"
                  value={formData.academicPercentage}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Family & Income */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-600" />
              <span>Step 3: Family & Income Scrutiny Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Father's / Guardian's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ST Sub-Tribe Community</label>
                <input
                  type="text"
                  name="stCommunity"
                  value={formData.stCommunity}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Gross Family Income (₹)</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Scheme-Specific Details */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary-600" />
              <span>Step 4: Scheme Grant Breakdown Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Accommodation Type</label>
                <select
                  name="dayScholarOrHosteller"
                  value={formData.dayScholarOrHosteller}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Hosteller">Hosteller (Eligible for Full Allowance)</option>
                  <option value="Day Scholar">Day Scholar</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Mandatory Tuition Fee (₹)</label>
                <input
                  type="number"
                  name="annualTuitionFee"
                  value={formData.annualTuitionFee}
                  onChange={handleFieldChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Are you receiving any other Government scholarship?</label>
              <select
                name="otherScholarshipAvailed"
                value={formData.otherScholarshipAvailed}
                onChange={handleFieldChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="No">No (Single Scholarship Availed)</option>
                <option value="Yes">Yes (Subject to NSP de-duplication check)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 5: Documents from DigiVault */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-teal-600" />
              <span>Step 5: Attach Verified Credentials from DigiVault</span>
            </h3>

            <p className="text-slate-600">
              The following documents are linked to this application. They will be authenticated against VeriCore registries:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {['Identity Document (Aadhaar)', 'ST Community Certificate', 'Income Certificate (Revenue Auth)', 'State Domicile Certificate', 'Previous Marksheet', 'Bonafide / Admission Receipt'].map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">{doc}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Credentials synced from your DigiVault. No physical paperwork required.</span>
            </div>
          </div>
        )}

        {/* Step 6: VeriCore Integration Verification Check */}
        {currentStep === 6 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Step 6: VeriCore Pre-Submission Automated Checks</span>
            </h3>

            <p className="text-slate-600">
              TRINEX is performing mock sandbox verification checks with central registries:
            </p>

            <div className="space-y-2">
              {[
                { name: 'DigiLocker ST Certificate Registry', status: 'MATCHED' },
                { name: 'UDISE+ School & Student Enrollment Database', status: 'MATCHED' },
                { name: 'APAAR Academic Credit Bank', status: 'MATCHED' },
                { name: 'AISHE Higher Education Institute Accreditation', status: 'MATCHED' },
                { name: 'State e-District Revenue Office Validation', status: 'MATCHED (Sandbox)' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
              <p className="font-semibold">Safety Assurance Protocol:</p>
              <p className="text-[11px] text-blue-800 mt-0.5">
                If an automated difference is detected during departmental processing, your record will be forwarded for manual review with an opportunity to submit clarification.
              </p>
            </div>
          </div>
        )}

        {/* Step 7: Final Preview */}
        {currentStep === 7 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Step 7: Review & Final Preview</span>
            </h3>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Scheme:</span>
                <span className="font-bold text-slate-900">{selectedScheme?.title}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">{formData.fullName} ({formData.gender})</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Institution & Course:</span>
                <span className="font-bold text-slate-900">{formData.course} @ {formData.institution}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Annual Family Income:</span>
                <span className="font-mono font-bold text-slate-900">₹{Number(formData.annualIncome).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Disbursement Method:</span>
                <span className="font-bold text-emerald-700">Aadhaar-seeded DBT Bank Account</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Submission Success */}
        {currentStep === 8 && submissionResult && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Application Submitted Successfully
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                Application ID: {submissionResult.applicationNo}
              </h2>
            </div>

            <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Date:</span>
                <span className="font-semibold text-slate-800">{submissionResult.submissionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scholarship Scheme:</span>
                <span className="font-semibold text-slate-800">{submissionResult.scheme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Status:</span>
                <span className="font-bold text-primary-700">{submissionResult.currentStatus}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Link
                to={`/applications/${submissionResult.applicationId}`}
                className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                Track Live Application
              </Link>
              <Link
                to="/dashboard"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        {currentStep < 8 && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Scholarship Application</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
