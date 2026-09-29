import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  Building,
  GraduationCap,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';

export const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    // Step 1: Account
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',

    // Step 2: Student Information
    dob: '',
    gender: 'Female',
    state: 'Odisha',
    district: 'Mayurbhanj',
    institution: '',
    course: '',
    yearOfStudy: '1st Year',

    // Step 3: Scholarship Information
    stStatus: 'Yes',
    pvtgStatus: 'No',
    familyIncome: '150000',
    disabilityStatus: 'No',
    domicile: 'Odisha',

    // Step 4: Consent
    termsAccepted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.mobile || !formData.password) {
        setError('Please fill all mandatory account fields.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.dob || !formData.institution || !formData.course) {
        setError('Please provide your date of birth, college/institution, and course name.');
        return;
      }
    }

    setError('');
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setError('You must accept the terms and provide consent for scholarship processing.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register(formData);
      if (res.success) {
        setSuccessMsg(`Account created successfully! Assigned Student ID: ${res.studentId || 'TRX-ST-NEW'}. Redirecting to Login...`);
        setTimeout(() => {
          navigate('/login');
        }, 2200);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Account' },
    { num: 2, title: 'Student Info' },
    { num: 3, title: 'Category' },
    { num: 4, title: 'Consent' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-indigo-950 p-6 text-white text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold text-primary-200 mb-2 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
            <span>Unified Student Onboarding</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Create Student Account</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Single registration for all central and state tribal scholarship schemes.
          </p>

          {/* Stepper Wizard Indicator */}
          <div className="flex items-center justify-between max-w-xs mx-auto mt-5">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === s.num
                      ? 'bg-primary-500 text-white ring-4 ring-primary-500/30'
                      : currentStep > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/20 text-slate-300'
                  }`}
                >
                  {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-10 sm:w-12 h-0.5 transition-all ${
                      currentStep > s.num ? 'bg-emerald-500' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account */}
            {currentStep === 1 && (
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Step 1: Account Credentials
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Ananya Kumar"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        name="password"
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Student Information */}
            {currentStep === 2 && (
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Step 2: Educational & Demographic Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Third Gender">Third Gender</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State of Residence</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    >
                      <option value="Odisha">Odisha</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Assam">Assam</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      name="district"
                      placeholder="e.g. Mayurbhanj"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">College / Institution *</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="institution"
                      placeholder="e.g. Government Autonomous College, Rourkela"
                      value={formData.institution}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Current Course *</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="course"
                        placeholder="e.g. B.Tech Computer Science"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Year of Study</label>
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    >
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="1st Year">1st Year (UG/Diploma)</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate (PG)">Postgraduate (PG)</option>
                      <option value="Ph.D. Scholar">Ph.D. Scholar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Scholarship Information */}
            {currentStep === 3 && (
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Step 3: Scholarship Eligibility Parameters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Tribe (ST) Status</label>
                    <select
                      name="stStatus"
                      value={formData.stStatus}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    >
                      <option value="Yes">Yes (ST Category)</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PVTG Community Status</label>
                    <select
                      name="pvtgStatus"
                      value={formData.pvtgStatus}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes (Particularly Vulnerable Tribal Group)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Annual Gross Family Income (in ₹) *
                  </label>
                  <input
                    type="number"
                    name="familyIncome"
                    placeholder="e.g. 150000"
                    value={formData.familyIncome}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Official threshold: ₹2.50 Lakhs for Pre/Post-Matric; ₹6.0 Lakhs for Top Class; ₹8.0 Lakhs for NOS.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Disability Status (PwD)</label>
                    <select
                      name="disabilityStatus"
                      value={formData.disabilityStatus}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes (≥40% Certified Disability)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Domicile State</label>
                    <input
                      type="text"
                      name="domicile"
                      placeholder="e.g. Odisha"
                      value={formData.domicile}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Consent */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Step 4: Statutory Consent & Undertaking
                </h3>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    Consent for Scholarship Processing & VeriCore Validation
                  </p>
                  <p>
                    I hereby declare that the educational, income, and community information provided above is accurate to the best of my knowledge.
                  </p>
                  <p>
                    I authorize TRINEX to verify my submitted credentials across authorized sandbox verification services (including DigiLocker, UDISE+, APAAR, and State Revenue records).
                  </p>
                  <p className="text-[11px] text-slate-500">
                    * In the event of any data mismatch, I understand my application will be forwarded for officer manual review rather than automatic rejection.
                  </p>
                </div>

                <label className="flex items-start gap-3 p-3 bg-primary-50/60 rounded-xl border border-primary-200 cursor-pointer text-xs text-slate-800 select-none">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-semibold">
                    I agree to the terms and consent to the use of my information for scholarship processing.
                  </span>
                </label>
              </div>
            )}

            {/* Buttons Navigation */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !formData.termsAccepted}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-600">
          Already registered on TRINEX?{' '}
          <Link to="/login" className="font-bold text-primary-700 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
