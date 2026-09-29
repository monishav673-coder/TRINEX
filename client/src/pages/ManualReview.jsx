import React, { useState, useEffect } from 'react';
import { officerService } from '../services/officerService';
import { StatusBadge } from '../components/StatusBadge';
import {
  SearchCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FileText,
  User,
  Building,
  Calendar,
  Send,
  X,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';

export const ManualReview = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionComments, setActionComments] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const res = await officerService.getReviews();
      if (res.success) {
        setQueue(res.queue || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAction = async (actionType) => {
    if (!selectedReview) return;
    setSubmittingAction(true);

    try {
      const res = await officerService.takeReviewAction(selectedReview.application_id, {
        actionTaken: actionType,
        comments: actionComments || `Officer executed: ${actionType}`
      });

      if (res.success) {
        setSuccessToast(`Action "${actionType}" executed successfully.`);
        setSelectedReview(null);
        setActionComments('');
        loadQueue();
        setTimeout(() => setSuccessToast(''), 4000);
      }
    } catch (err) {
      alert('Action failed: ' + err.message);
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-navy-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-bold">
              Exception & Discrepancy Scrutiny
            </span>
            <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded">
              Zero Automatic Rejection Standard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Manual Review Queue
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl mt-1 leading-relaxed">
            Automated verification differences routed for authorized officer evaluation. Inspect student claims, request clarification, or verify valid exceptions.
          </p>
        </div>

        <button
          onClick={loadQueue}
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Review Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Pending Discrepancies Requiring Action ({queue.length})
          </h3>
          <span className="text-xs text-slate-400">All cases retain full audit logging</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading review queue...</div>
        ) : queue.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No Pending Exceptions</h4>
            <p className="text-xs text-slate-500 mt-1">All automated and manual reviews are up to date.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Application ID</th>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Scheme</th>
                  <th className="px-5 py-3.5">Mismatch / Flag</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((item) => (
                  <tr key={item.application_id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-primary-700">
                      {item.application_no}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{item.student_name}</p>
                      <span className="text-[10px] text-slate-400">{item.student_code} • {item.district}</span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {item.scholarship_title}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        {item.mismatch_service || 'Income Variance'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.application_status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedReview(item)}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Officer Inspector Action Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-navy-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded text-primary-200">
                  {selectedReview.application_no}
                </span>
                <h3 className="font-bold text-base text-white mt-1">
                  Manual Review: {selectedReview.student_name}
                </h3>
              </div>
              <button onClick={() => setSelectedReview(null)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Student Demographics */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applicant Details</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedReview.student_name} ({selectedReview.student_code})</span>
                  <span className="text-[11px] text-slate-500">{selectedReview.student_email} • {selectedReview.student_mobile}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Institute</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedReview.institution}</span>
                  <span className="text-[11px] text-slate-500">Location: {selectedReview.district}, {selectedReview.state}</span>
                </div>
              </div>

              {/* Mismatch & Verification Details */}
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2 text-amber-900">
                <h4 className="font-bold text-xs flex items-center gap-1.5 text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Flagged Discrepancy Reason</span>
                </h4>
                <p className="text-[11px] leading-relaxed">
                  {selectedReview.mismatch_reason || 'Income certificate difference between declared gross family income (₹1.80L) and net agricultural slip (₹1.50L). Within scheme ceiling of ₹2.50 Lakhs.'}
                </p>

                {selectedReview.clarification_note && (
                  <div className="mt-2 pt-2 border-t border-amber-200/80 text-[11px]">
                    <span className="font-bold block text-amber-950">Student Submitted Clarification:</span>
                    <p className="italic bg-white p-2 rounded-xl mt-1 border border-amber-200">
                      "{selectedReview.clarification_note}"
                    </p>
                  </div>
                )}
              </div>

              {/* Officer Note Input */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Officer Scrutiny Remarks & Decision Note
                </label>
                <textarea
                  rows="3"
                  placeholder="Record your observation or specific document requirement..."
                  value={actionComments}
                  onChange={(e) => setActionComments(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary-500 outline-none leading-relaxed text-slate-800"
                />
              </div>

              {/* Zero Automatic Rejection Assurance */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <p>
                  As an authorized officer, choose between requesting further clarification, marking the discrepancy resolved (Mark Verified), or returning for correction. Automated rejection is restricted to maintain equitable access.
                </p>
              </div>
            </div>

            {/* Officer Action Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>

              <button
                type="button"
                disabled={submittingAction}
                onClick={() => handleTakeAction('Request Clarification')}
                className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-xl transition-all shadow-xs"
              >
                Request Clarification
              </button>

              <button
                type="button"
                disabled={submittingAction}
                onClick={() => handleTakeAction('Return for Correction')}
                className="px-3.5 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all shadow-xs"
              >
                Return for Correction
              </button>

              <button
                type="button"
                disabled={submittingAction}
                onClick={() => handleTakeAction('Mark Verified')}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Verified</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
