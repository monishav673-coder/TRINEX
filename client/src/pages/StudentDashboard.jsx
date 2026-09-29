import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../services/applicationService';
import { scholarshipService } from '../services/scholarshipService';
import { ProgressTracker } from '../components/ProgressTracker';
import { StatusBadge } from '../components/StatusBadge';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderLock,
  ShieldCheck,
  CreditCard,
  Bot,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [currentApp, setCurrentApp] = useState(null);
  const [stats, setStats] = useState({
    total: 3,
    approved: 1,
    underReview: 1,
    actionRequired: 1
  });
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentName = user?.fullName || 'Ananya Kumar';
  const studentId = user?.studentId || user?.profile?.student_id || 'TRX-ST-10024';
  const profileCompletion = user?.profile?.profile_completion || 85;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const appRes = await applicationService.getAll();
      if (appRes.success && appRes.applications.length > 0) {
        // Look for the active primary application TRX-2026-00184 or latest
        const primary = appRes.applications.find(a => a.application_no === 'TRX-2026-00184') || appRes.applications[0];
        setCurrentApp(primary);

        const apps = appRes.applications;
        setStats({
          total: apps.length,
          approved: apps.filter(a => ['Sanctioned', 'Disbursement', 'Completed'].includes(a.status)).length,
          underReview: apps.filter(a => ['Submitted', 'Document Verification', 'Institution Verification', 'Department Verification'].includes(a.status)).length,
          actionRequired: apps.filter(a => ['Manual Review Required', 'Clarification Required', 'Action Required'].includes(a.status)).length
        });
      }

      const schRes = await scholarshipService.getAll();
      if (schRes.success) {
        setRecommended(schRes.scholarships.slice(0, 2));
      }
    } catch (err) {
      console.warn('Dashboard data fetch note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner with Greeting & Profile Progress */}
      <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-white/10 text-primary-200 px-2.5 py-0.5 rounded-full font-mono font-semibold border border-white/10">
              Student ID: {studentId}
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
              ● Active Scholar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good morning, {studentName} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Welcome to your TRINEX unified portal. Track your application scrutiny, manage verified digital credentials, and review DBT disbursements.
          </p>
        </div>

        {/* Profile Completion Dial Card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 shrink-0 min-w-[240px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200">Profile Completion</span>
            <span className="text-sm font-extrabold text-saffron-400 font-mono">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-saffron-500 to-amber-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <Link
            to="/profile"
            className="text-[11px] font-bold text-primary-200 hover:text-white flex items-center justify-between group"
          >
            <span>Complete 100% for faster verification</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Quick Statistics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applications</span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{stats.total}</h3>
            <span className="text-[10px] text-slate-500">Active & archived</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center border border-blue-100">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved / Sanctioned</span>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1 font-mono">{stats.approved}</h3>
            <span className="text-[10px] text-emerald-600 font-medium">Pre-Matric Archive</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Under Review</span>
            <h3 className="text-2xl font-extrabold text-primary-700 mt-1 font-mono">{stats.underReview}</h3>
            <span className="text-[10px] text-primary-600 font-medium">Department Scrutiny</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Required</span>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">{stats.actionRequired}</h3>
            <span className="text-[10px] text-amber-600 font-medium">1 Clarification Note</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Current Active Application Tracker Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-md">
                Current Application
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500">
                Application ID: {currentApp?.application_no || 'TRX-2026-00184'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {currentApp?.scholarship_title || 'Post-Matric Scholarship for ST Students'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={currentApp?.status || 'Department Verification'} size="lg" />
            <Link
              to={`/applications/${currentApp?.id || 'app-trx-2026-00184'}`}
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 shrink-0"
            >
              <span>View Application</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="p-6 bg-white">
          <div className="mb-2">
            <span className="text-xs font-bold text-slate-700">Scrutiny & Verification Pipeline</span>
            <p className="text-[11px] text-slate-500">
              Multi-tier verification across digital credentials, college nodal officer, and state welfare scrutiny.
            </p>
          </div>

          <ProgressTracker currentStatus={currentApp?.status || 'Department Verification'} />

          <div className="mt-4 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-primary-900">Active Stage: Department Verification</span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Your application has passed Institution bonafide review and is currently being scrutinized by the District Tribal Welfare Office (Mayurbhanj). No action required unless an officer clarification is posted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Quick Jump Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/digivault"
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FolderLock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">DigiVault Wallet</h4>
          <p className="text-xs text-slate-500 mt-1">6 digital documents saved & reusable across schemes.</p>
        </Link>

        <Link
          to="/vericore"
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">VeriCore Hub</h4>
          <p className="text-xs text-slate-500 mt-1">10 Unified integration sandboxes active.</p>
        </Link>

        <Link
          to="/fundtrack"
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">FundTrack DBT</h4>
          <p className="text-xs text-slate-500 mt-1">₹38,000 Sanctioned; PFMS batch processing active.</p>
        </Link>

        <Link
          to="/jago"
          className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-purple-950">JAGO AI Assistant</h4>
          <p className="text-xs text-purple-700 mt-1">Ask questions regarding your missing docs or status.</p>
        </Link>
      </div>

      {/* Section 11: Scholarship Recommendations "Scholarships for You" */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-600" />
              <span>Scholarships for You</span>
            </h3>
            <p className="text-xs text-slate-500">
              Preliminary recommendations based on your Scheduled Tribe profile.
            </p>
          </div>

          <Link
            to="/scholarships"
            className="text-xs font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1"
          >
            <span>Browse All Schemes</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommended.map((sch) => (
            <div key={sch.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                    {sch.category}
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Potentially Eligible
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 mb-1">{sch.title}</h4>
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                  "Your profile matches several preliminary criteria for {sch.category}."
                </p>

                <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700 mb-3">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Benefit Grant</span>
                  <span className="font-bold text-emerald-700">{sch.max_amount}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/eligibility?scheme=${sch.id}`}
                  className="text-xs font-bold text-primary-700 hover:text-primary-800 hover:underline"
                >
                  Check Details
                </Link>
                <Link
                  to={`/apply?scheme=${sch.id}`}
                  className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
                >
                  Start Application
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
