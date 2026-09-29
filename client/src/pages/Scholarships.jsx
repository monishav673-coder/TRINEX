import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { scholarshipService } from '../services/scholarshipService';
import { ScholarshipCard } from '../components/ScholarshipCard';
import {
  Award,
  Search,
  Filter,
  X,
  Calendar,
  IndianRupee,
  CheckCircle2,
  FileText,
  Building,
  Info,
  ChevronRight
} from 'lucide-react';

export const Scholarships = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedModalScheme, setSelectedModalScheme] = useState(null);

  const categories = [
    { id: 'ALL', label: 'All Schemes' },
    { id: 'Pre-Matric', label: 'Pre-Matric (9-10)' },
    { id: 'Post-Matric', label: 'Post-Matric (Higher Ed)' },
    { id: 'Top Class', label: 'Top Class (Premier)' },
    { id: 'Fellowship', label: 'NFST (M.Phil / Ph.D.)' },
    { id: 'Overseas', label: 'NOS (Overseas)' }
  ];

  useEffect(() => {
    loadScholarships();
  }, [selectedCategory]);

  const loadScholarships = async () => {
    setLoading(true);
    try {
      const res = await scholarshipService.getAll({
        category: selectedCategory === 'ALL' ? undefined : selectedCategory
      });
      if (res.success) {
        setScholarships(res.scholarships || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = scholarships.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.education_level.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200/60">
              Scholarship Hub
            </span>
            <span className="text-xs text-slate-500 font-medium">Ministry of Tribal Affairs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Centrally Sponsored & Central Sector Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            Discover verified financial aid schemes for Scheduled Tribe students across secondary, post-secondary, premier institutes, doctoral fellowships, and international studies.
          </p>
        </div>

        <Link
          to="/eligibility"
          className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Award className="w-4 h-4" />
          <span>Interactive Eligibility Checker</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemes or level..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none transition-all"
          />
        </div>
      </div>

      {/* Grid of Scholarships */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-3">
              <div className="w-1/3 h-4 bg-slate-200 rounded" />
              <div className="w-3/4 h-6 bg-slate-200 rounded" />
              <div className="w-full h-16 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No scholarships matching your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or select "All Schemes" to view the complete catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sch) => (
            <ScholarshipCard
              key={sch.id}
              scholarship={sch}
              onSelectDetails={(scheme) => setSelectedModalScheme(scheme)}
            />
          ))}
        </div>
      )}

      {/* Detailed Modal Popup */}
      {selectedModalScheme && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-navy-900 to-indigo-950 text-white flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-primary-200 px-2 py-0.5 rounded border border-white/10">
                  {selectedModalScheme.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedModalScheme.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedModalScheme(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  Scheme Description
                </h4>
                <p className="text-slate-600 leading-relaxed">{selectedModalScheme.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Target Education Level</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{selectedModalScheme.education_level}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Benefit Amount / Allowance</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block">{selectedModalScheme.max_amount}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Application Deadline</span>
                  <span className="font-semibold text-amber-700 mt-0.5 block">{selectedModalScheme.deadline}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Scheme Code</span>
                  <span className="font-mono font-bold text-slate-800 mt-0.5 block">{selectedModalScheme.code}</span>
                </div>
              </div>

              {selectedModalScheme.requiredDocuments && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                    Required Documents in DigiVault
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedModalScheme.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-slate-700 leading-relaxed text-[11px]">
                <Info className="w-3.5 h-3.5 text-primary-600 inline mr-1" />
                <span>Note: Sourced directly from official guidelines of the Ministry of Tribal Affairs. Applications are routed through TRINEX DigiVault and VeriCore without manual duplication.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <Link
                to={`/eligibility?scheme=${selectedModalScheme.id}`}
                className="px-4 py-2 text-xs font-bold text-primary-700 hover:bg-primary-50 rounded-xl border border-primary-200 transition-colors"
              >
                Check Eligibility
              </Link>
              <Link
                to={`/apply?scheme=${selectedModalScheme.id}`}
                className="px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition-colors flex items-center gap-1"
              >
                <span>Proceed to Apply</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
