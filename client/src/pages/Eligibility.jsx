import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { scholarshipService } from '../services/scholarshipService';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Info,
  Building2,
  GraduationCap
} from 'lucide-react';

export const Eligibility = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    educationLevel: 'Undergraduate',
    course: user?.profile?.course || 'B.Tech Computer Science',
    year: user?.profile?.year_of_study || '3rd Year',
    institutionType: 'State Government College / University',
    stStatus: 'Yes',
    pvtgStatus: 'No',
    familyIncome: user?.profile?.family_income || '150000',
    academicPerformance: '82.5',
    disabilityStatus: 'No',
    netJrfStatus: 'None',
    overseasStudy: 'No',
    currentScholarshipStatus: 'None'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await scholarshipService.checkEligibility(formData);
      if (res.success) {
        setResults(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200/60">
            Smart Matching Engine
          </span>
          <span className="text-xs text-slate-400 font-mono">Algorithm v2.6</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Interactive Scholarship Eligibility Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Evaluate your eligibility across 12 academic, demographic, and financial parameters against official Ministry of Tribal Affairs guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary-600" />
              <span>Academic & Demographic Profile Parameters</span>
            </h3>

            {/* 1 & 2. Education Level & Course */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">1. Education Level *</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                >
                  <option value="Class 9">Class 9 (Secondary)</option>
                  <option value="Class 10">Class 10 (Secondary)</option>
                  <option value="Class 11">Class 11 (Higher Secondary)</option>
                  <option value="Class 12">Class 12 (Higher Secondary)</option>
                  <option value="Diploma">Diploma / Polytechnic / ITI</option>
                  <option value="Undergraduate">Undergraduate (B.Tech, B.Sc, B.A, MBBS, etc.)</option>
                  <option value="Postgraduate">Postgraduate (M.Tech, M.Sc, M.A, MBA)</option>
                  <option value="Ph.D.">Ph.D. / M.Phil (Doctoral Research)</option>
                  <option value="International Studies">International Master's / Ph.D. Abroad</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">2. Specific Course / Major</label>
                <input
                  type="text"
                  name="course"
                  placeholder="e.g. B.Tech Computer Science"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            {/* 3 & 4. Year & Institution Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">3. Current Year of Study</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                >
                  <option value="1st Year">1st Year / Fresh</option>
                  <option value="2nd Year">2nd Year / Renewal</option>
                  <option value="3rd Year">3rd Year / Renewal</option>
                  <option value="4th Year">4th Year / Renewal</option>
                  <option value="Final Year">Final Year</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">4. Institution Type *</label>
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                >
                  <option value="State Government College / University">State Government College / University</option>
                  <option value="Premier / National Institute (IIT, NIT, IIM, AIIMS, NLU)">Premier Notified Institute (IIT, NIT, IIM, AIIMS, NLU)</option>
                  <option value="Central University">Central University</option>
                  <option value="Government Aided School / College">Government Aided Institution</option>
                  <option value="Recognized Private University">Recognized Private University</option>
                  <option value="QS Top 500 Global University">QS Top 500 Global University (Overseas)</option>
                </select>
              </div>
            </div>

            {/* 5 & 6. ST Status & PVTG Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">5. Scheduled Tribe (ST) Status *</label>
                <select
                  name="stStatus"
                  value={formData.stStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                >
                  <option value="Yes">Yes (ST Category Holder)</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">6. PVTG Status</label>
                <select
                  name="pvtgStatus"
                  value={formData.pvtgStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes (Particularly Vulnerable Tribal Group)</option>
                </select>
              </div>
            </div>

            {/* 7 & 8. Family Income & Academic Score */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">7. Annual Family Income (in ₹) *</label>
                <input
                  type="number"
                  name="familyIncome"
                  value={formData.familyIncome}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">8. Academic Performance (% / CGPA)</label>
                <input
                  type="number"
                  name="academicPerformance"
                  placeholder="e.g. 82.5"
                  value={formData.academicPerformance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            {/* 9 & 10. Disability & NET/JRF */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">9. Disability Status (PwD)</label>
                <select
                  name="disabilityStatus"
                  value={formData.disabilityStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes (≥ 40% Disability)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">10. NET / JRF / GATE Status</label>
                <select
                  name="netJrfStatus"
                  value={formData.netJrfStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                >
                  <option value="None">None / Not Appeared</option>
                  <option value="UGC-NET Qualified">UGC-NET Qualified</option>
                  <option value="CSIR-NET Qualified">CSIR-NET Qualified</option>
                  <option value="GATE Qualified">GATE Qualified</option>
                </select>
              </div>
            </div>

            {/* 11 & 12. Overseas Study & Current Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">11. Applying for Overseas Studies?</label>
                <select
                  name="overseasStudy"
                  value={formData.overseasStudy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                >
                  <option value="No">No (Domestic Studies)</option>
                  <option value="Yes">Yes (QS Top 500 Admitted)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">12. Current Scholarship Status</label>
                <select
                  name="currentScholarshipStatus"
                  value={formData.currentScholarshipStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none"
                >
                  <option value="None">None (Fresh Applicant)</option>
                  <option value="Pre-Matric Availed Earlier">Pre-Matric Availed Earlier</option>
                  <option value="Currently on State Scheme">Currently on State Scheme</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Evaluate Potential Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Sidebar Container */}
        <div className="space-y-4">
          {results ? (
            <div className="bg-white rounded-3xl border border-primary-200 p-5 shadow-lg space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {results.resultText}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {results.matchedCount} Scheme(s) Matched
                </span>
              </div>

              {results.recommendations && results.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{rec.schemeTitle}</h4>
                    <span className="bg-primary-100 text-primary-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                      {rec.confidence}% Match
                    </span>
                  </div>

                  {/* Matched criteria */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Matched Criteria
                    </span>
                    <ul className="space-y-1">
                      {rec.matchedCriteria.map((c, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Missing information if any */}
                  {rec.missingInformation && rec.missingInformation.length > 0 && (
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider block">Additional Info Needed:</span>
                      <p className="text-[11px]">{rec.missingInformation.join(', ')}</p>
                    </div>
                  )}

                  {/* Required Documents */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Required Documents
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {rec.requiredDocuments.map((d, dIdx) => (
                        <span key={dIdx} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Important Notes */}
                  <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-xl border border-slate-100">
                    💡 {rec.importantNotes}
                  </p>

                  <Link
                    to={`/apply?scheme=${rec.schemeId}`}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-2 rounded-xl text-center block transition-all shadow-xs"
                  >
                    Start Application
                  </Link>
                </div>
              ))}

              {/* Mandatory Disclaimer */}
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-normal">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
                <span>{results.disclaimer}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary-600 flex items-center justify-center mx-auto border border-blue-100">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Instant Eligibility Assessment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fill out the 12 profile parameters on the left and click "Evaluate Potential Eligibility" to see scheme recommendations with tailored document requirements.
              </p>
            </div>
          )}

          {/* Guidelines Box */}
          <div className="bg-slate-900 text-slate-300 rounded-3xl p-5 border border-slate-800 text-xs space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary-400" />
              <span>Official Scheme Income Caps</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>• <strong>Pre & Post-Matric ST:</strong> ₹2.50 Lakhs / annum</li>
              <li>• <strong>Top Class Premier:</strong> ₹6.00 Lakhs / annum</li>
              <li>• <strong>National Fellowship (NFST):</strong> No income ceiling</li>
              <li>• <strong>Overseas Scholarship (NOS):</strong> ₹8.00 Lakhs / annum</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
