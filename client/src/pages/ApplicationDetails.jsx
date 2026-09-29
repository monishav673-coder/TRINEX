import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { ProgressTracker } from '../components/ProgressTracker';
import { StatusBadge } from '../components/StatusBadge';
import {
  FileText,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderLock,
  ArrowLeft,
  ChevronRight,
  User,
  Info
} from 'lucide-react';

export const ApplicationDetails = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getById(id);
      if (res.success) {
        setApp(res.application);
      } else {
        setError('Application record not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load application record.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading scholarship application record...</p>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-900">{error || 'Application Not Found'}</h3>
        <Link to="/dashboard" className="text-xs font-bold text-primary-600 hover:underline mt-2 inline-block">
          Return to Student Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          {app.academic_year || '2026-2027'} Cycle
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-200">
              {app.application_no}
            </span>
            <span className="text-xs text-slate-500">Submitted: {app.submission_date}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {app.scholarship_title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Applicant: {app.student_name} (ID: {app.student_code}) • {app.institution}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={app.status} size="lg" />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Official Scrutiny Progress</h3>
          <p className="text-xs text-slate-500">
            Real-time tracking of institutional bonafide checks, departmental scrutiny, and DBT disbursement.
          </p>
        </div>

        <ProgressTracker currentStatus={app.status} />

        {/* Detailed Timeline Audit Logs */}
        {app.timeline && app.timeline.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Application Activity History
            </h4>
            <div className="space-y-2.5">
              {app.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.status}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">{item.notes}</p>
                    <span className="text-[10px] text-slate-400">By: {item.updated_by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VeriCore Verification Logs Grid */}
      {app.verificationRecords && app.verificationRecords.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>VeriCore Sandbox Integrations Status</span>
            </h3>
            <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
              Demo Environment
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {app.verificationRecords.map((vr) => (
              <div key={vr.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-2 text-xs">
                <div>
                  <h4 className="font-bold text-slate-800">{vr.service_name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {vr.status === 'MATCHED' ? '✓ Verified with Central Registry' : (vr.mismatch_reason || 'Discrepancy Under Review')}
                  </p>
                  <span className="text-[10px] text-slate-400">Checked: {vr.checked_at}</span>
                </div>
                <StatusBadge status={vr.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Information if Available */}
      {app.payment && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>FundTrack Disbursement Status</span>
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
              Ref: {app.payment.transaction_ref}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs bg-white/70 p-3 rounded-2xl border border-emerald-100">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Sanctioned</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">₹{Number(app.payment.sanctioned_amount).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Status</span>
              <span className="font-bold text-primary-700">{app.payment.payment_status}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">DBT Account</span>
              <span className="font-mono text-slate-700">{app.payment.bank_account_masked}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
