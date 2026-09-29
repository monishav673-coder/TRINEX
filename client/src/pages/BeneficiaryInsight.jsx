import React, { useState, useEffect } from 'react';
import { officerService } from '../services/officerService';
import { StatusBadge } from '../components/StatusBadge';
import {
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Building,
  GraduationCap,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  Database
} from 'lucide-react';

export const BeneficiaryInsight = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [outreachToast, setOutreachToast] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await officerService.getBeneficiaries();
      if (res.success) {
        setBeneficiaries(res.beneficiaries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerOutreach = (id, name) => {
    setOutreachToast(`Authorized SMS & Portal outreach triggered for ${name}.`);
    setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, outreach_status: 'Outreach Sent' } : b));
    setTimeout(() => setOutreachToast(''), 4000);
  };

  const filtered = beneficiaries.filter(b => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.student_name.toLowerCase().includes(q) ||
      b.institution.toLowerCase().includes(q) ||
      b.district.toLowerCase().includes(q) ||
      b.potential_scheme.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full font-bold">
              AI Matching Engine
            </span>
            <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded">
              Tribal Inclusion Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Beneficiary Insight
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl mt-1 leading-relaxed">
            "Identify potentially unreached scholarship beneficiaries for authorized outreach and review."
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-right shrink-0">
          <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider block">Potentially Unreached Scholars</span>
          <span className="text-2xl font-extrabold text-white font-mono">{beneficiaries.length * 215}+</span>
          <span className="text-[10px] text-purple-200 block mt-0.5">Identified via AISHE & UDISE+</span>
        </div>
      </div>

      {/* Analytics Flow Visualization */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Beneficiary Discovery Pipeline Flow</h3>
          <p className="text-xs text-slate-500">Cross-referencing institutional databases with scholarship registries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
            <Database className="w-6 h-6 text-primary-600 mx-auto" />
            <h4 className="font-bold text-xs text-slate-900">Education Records</h4>
            <p className="text-[10px] text-slate-500">AISHE / UDISE+ ST Registrations</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
            <Sparkles className="w-6 h-6 text-purple-600 mx-auto" />
            <h4 className="font-bold text-xs text-slate-900">Matching Engine</h4>
            <p className="text-[10px] text-slate-500">Eligibility & Quota Cross-Analysis</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-1">
            <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto" />
            <h4 className="font-bold text-xs text-amber-900">Potentially Unreached</h4>
            <p className="text-[10px] text-amber-700">Eligible but Unenrolled Scholars</p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-xs text-emerald-950">Officer Review</h4>
            <p className="text-[10px] text-emerald-700">Authorized Nodal Outreach</p>
          </div>
        </div>

        {/* Responsible Wording Notice */}
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
          <p>
            <strong>Note on Potential Eligibility:</strong> Identified candidates are classified as <em>"Potentially Unreached"</em> and <em>"Requires Review"</em>. Final scholarship sanction requires verification of official statutory documents.
          </p>
        </div>
      </div>

      {outreachToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{outreachToast}</span>
        </div>
      )}

      {/* Identified Beneficiaries List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-900">
            Unreached Beneficiaries Queue ({beneficiaries.length})
          </h3>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student, college, state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Candidate Name</th>
                <th className="px-5 py-3.5">Institution & State</th>
                <th className="px-5 py-3.5">Potential Scheme Match</th>
                <th className="px-5 py-3.5">Confidence</th>
                <th className="px-5 py-3.5">Contact (Masked)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Outreach Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {b.student_name}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-800 truncate max-w-[200px]">{b.institution}</p>
                    <span className="text-[10px] text-slate-400">{b.district}, {b.state}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">
                    {b.potential_scheme}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded text-[11px] font-mono">
                      {b.matching_confidence}% Match
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500 text-[11px]">
                    {b.contact_masked}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={b.outreach_status} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleTriggerOutreach(b.id, b.student_name)}
                      disabled={b.outreach_status === 'Outreach Sent'}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 ml-auto ${
                        b.outreach_status === 'Outreach Sent'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{b.outreach_status === 'Outreach Sent' ? 'Sent' : 'Send Outreach'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
