import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { officerService } from '../services/officerService';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  Shield,
  FileText,
  Clock,
  SearchCheck,
  CheckCircle2,
  CreditCard,
  Users,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const OfficerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await officerService.getDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {
    totalApplications: 2583,
    pendingVerification: 341,
    manualReviewCount: 49,
    approvedCount: 1921,
    sanctionedCount: 1851,
    disbursedCount: 1421,
    unreachedCount: 854
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-navy-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full font-bold">
              Officer Command Center
            </span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
              Demo Analytics & Scrutiny Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welfare Scrutiny & Disbursement Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            State Tribal Welfare Directorate • Multi-tier scholarship verification, manual discrepancy resolution, and DBT pipeline monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/officer/manual-review"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <SearchCheck className="w-4 h-4" />
            <span>Manual Review Queue ({stats.manualReviewCount})</span>
          </Link>
        </div>
      </div>

      {/* 7 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Applications</span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1 font-mono">{stats.totalApplications}</h3>
          <span className="text-[10px] text-slate-500">2026-27 Cycle</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Veri</span>
          <h3 className="text-xl font-extrabold text-primary-700 mt-1 font-mono">{stats.pendingVerification}</h3>
          <span className="text-[10px] text-primary-600">VeriCore Pipeline</span>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-subtle">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Manual Review</span>
          <h3 className="text-xl font-extrabold text-amber-900 mt-1 font-mono">{stats.manualReviewCount}</h3>
          <span className="text-[10px] text-amber-700 font-semibold">Exceptions flagged</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dept Approved</span>
          <h3 className="text-xl font-extrabold text-indigo-700 mt-1 font-mono">{stats.approvedCount}</h3>
          <span className="text-[10px] text-indigo-600">Scrutiny cleared</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sanctioned</span>
          <h3 className="text-xl font-extrabold text-emerald-700 mt-1 font-mono">{stats.sanctionedCount}</h3>
          <span className="text-[10px] text-emerald-600">Orders Issued</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-subtle">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Disbursed DBT</span>
          <h3 className="text-xl font-extrabold text-teal-700 mt-1 font-mono">{stats.disbursedCount}</h3>
          <span className="text-[10px] text-teal-600">Bank Credited</span>
        </div>

        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 shadow-subtle">
          <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Unreached ST</span>
          <h3 className="text-xl font-extrabold text-purple-900 mt-1 font-mono">{stats.unreachedCount}</h3>
          <span className="text-[10px] text-purple-700 font-semibold">Matching Engine</span>
        </div>
      </div>

      {/* Visual Analytics Charts with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Application & Sanction Velocity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Monthly Application & Sanction Trend</h3>
              <p className="text-[11px] text-slate-500">Intake vs. Verified & Sanctioned Volume (2026)</p>
            </div>
            <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">Demo Data</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={2.5} name="Applications Received" />
                <Line type="monotone" dataKey="verified" stroke="#8B5CF6" strokeWidth={2.5} name="Verified" />
                <Line type="monotone" dataKey="sanctioned" stroke="#10B981" strokeWidth={2.5} name="Sanctioned" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Scheme Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Scholarship Scheme Distribution</h3>
              <p className="text-[11px] text-slate-500">Applicant share across 5 major tribal schemes</p>
            </div>
            <span className="text-[10px] bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">Demo Data</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.schemeDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {(data?.schemeDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/officer/manual-review"
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <SearchCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Manual Review Queue</h4>
          <p className="text-xs text-slate-500 mt-1">Review flagged discrepancies & student clarifications.</p>
        </Link>

        <Link
          to="/officer/beneficiary-insight"
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Beneficiary Insight</h4>
          <p className="text-xs text-slate-500 mt-1">Identify unreached ST students via institutional matching.</p>
        </Link>

        <Link
          to="/officer/applications"
          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary-700 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Application Registry</h4>
          <p className="text-xs text-slate-500 mt-1">Browse, filter, and inspect student application files.</p>
        </Link>
      </div>
    </div>
  );
};
