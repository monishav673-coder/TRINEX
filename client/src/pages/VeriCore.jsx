import React, { useState, useEffect } from 'react';
import { verificationService } from '../services/verificationService';
import { VerificationCard } from '../components/VerificationCard';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Info,
  X,
  Send,
  Sparkles,
  FileCheck
} from 'lucide-react';

export const VeriCore = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clarificationModal, setClarificationModal] = useState(null);
  const [clarificationText, setClarificationText] = useState('');
  const [submittingClarification, setSubmittingClarification] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await verificationService.getOverview();
      if (res.success) {
        setIntegrations(res.integrations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClarificationSubmit = async (e) => {
    e.preventDefault();
    if (!clarificationText.trim()) return;

    setSubmittingClarification(true);
    try {
      const res = await verificationService.submitClarification(
        clarificationModal.id || 'State e-District',
        clarificationText.trim()
      );
      if (res.success) {
        setSuccessToast('Clarification submitted successfully. Forwarded to Officer Manual Review Queue.');
        setClarificationModal(null);
        setClarificationText('');
        loadOverview();
        setTimeout(() => setSuccessToast(''), 4000);
      }
    } catch (err) {
      alert('Failed to submit clarification: ' + err.message);
    } finally {
      setSubmittingClarification(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-navy-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full font-bold">
              10 Unified Integrations
            </span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
              Demo / Sandbox Integrations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            VeriCore
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mt-1 leading-relaxed">
            "Unified Scholarship Verification Center" — Automated pre-scrutiny hub connecting DigiLocker, UDISE+, APAAR, AISHE, and state registries.
          </p>
        </div>

        <button
          onClick={loadOverview}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-check Registries</span>
        </button>
      </div>

      {/* Safety Protocol Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Zero Automatic Rejection Policy:</span>
          <p className="text-slate-600 mt-0.5">
            If any discrepancy or data difference is detected during automated verification checks (such as income declaration variances), TRINEX immediately routes your application to <strong>Manual Review Required</strong>. An authorized officer will inspect your documents and review any clarifications you submit.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 10 Integrations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-3">
              <div className="w-1/2 h-4 bg-slate-200 rounded" />
              <div className="w-full h-16 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item) => (
            <VerificationCard
              key={item.id}
              integration={item}
              onOpenClarification={(target) => setClarificationModal(target)}
            />
          ))}
        </div>
      )}

      {/* Clarification Submission Modal */}
      {clarificationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  Manual Review Escalation
                </span>
                <h3 className="font-bold text-sm text-white mt-1">
                  Submit Clarification for {clarificationModal.name}
                </h3>
              </div>
              <button onClick={() => setClarificationModal(null)} className="text-white hover:bg-white/10 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClarificationSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                <span className="font-bold block mb-1">Flagged Discrepancy Note:</span>
                <p className="text-[11px] leading-relaxed">
                  {clarificationModal.mismatchReason || 'Income certificate difference between gross family declaration and revenue portal record.'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Your Clarification Statement / Justification *
                </label>
                <textarea
                  rows="4"
                  placeholder="Explain the reason for the variation (e.g., Gross income includes non-taxable agricultural allowance; net family income is within ₹1.5 Lakhs limit)..."
                  value={clarificationText}
                  onChange={(e) => setClarificationText(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none leading-relaxed text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClarificationModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingClarification || !clarificationText.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  {submittingClarification ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit to Officer</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
