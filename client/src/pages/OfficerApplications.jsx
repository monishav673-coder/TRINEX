import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { StatusBadge } from '../components/StatusBadge';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  RefreshCw,
  Building,
  GraduationCap
} from 'lucide-react';

export const OfficerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getAll();
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications.filter((a) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.application_no.toLowerCase().includes(q) ||
      (a.student_name && a.student_name.toLowerCase().includes(q)) ||
      (a.scholarship_title && a.scholarship_title.toLowerCase().includes(q)) ||
      (a.district && a.district.toLowerCase().includes(q))
    );
  });

  const statuses = [
    'ALL',
    'Submitted',
    'Document Verification',
    'Institution Verification',
    'Department Verification',
    'Manual Review Required',
    'Sanctioned',
    'Completed'
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200">
            State Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Application Registry & Scrutiny
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, inspect, and evaluate student applications across all 5 tribal scholarship schemes.
          </p>
        </div>

        <button
          onClick={loadApps}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-subtle flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-bold">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                statusFilter === s
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name, district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading application files...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No Applications Found</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or search parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Application No</th>
                  <th className="px-5 py-3.5">Student Name</th>
                  <th className="px-5 py-3.5">Scheme</th>
                  <th className="px-5 py-3.5">Institution & District</th>
                  <th className="px-5 py-3.5">Submission Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-primary-700">
                      {a.application_no}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{a.student_name || 'Ananya Kumar'}</p>
                      <span className="text-[10px] text-slate-400">{a.student_code || 'TRX-ST-10024'}</span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {a.scholarship_title}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-800 truncate max-w-[180px]">{a.institution || 'Govt College'}</p>
                      <span className="text-[10px] text-slate-500">{a.district || 'Mayurbhanj'}, {a.state || 'Odisha'}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-mono">
                      {a.submission_date}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={a.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/applications/${a.id}`}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
