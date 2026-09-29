import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  GraduationCap,
  Compass,
  Globe,
  Calendar,
  IndianRupee,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const iconMap = {
  BookOpen,
  GraduationCap,
  Award,
  Compass,
  Globe
};

export const ScholarshipCard = ({ scholarship, onSelectDetails, isRecommended = false }) => {
  const Icon = iconMap[scholarship.icon_name] || Award;
  const criteria = scholarship.eligibilityCriteria || {};
  const documents = scholarship.requiredDocuments || [];

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between ${
      isRecommended ? 'border-primary-300 ring-2 ring-primary-100 shadow-md' : 'border-slate-200/90 shadow-subtle'
    }`}>
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-50 to-blue-100 text-primary-700 flex items-center justify-center border border-primary-200 shrink-0 shadow-sm">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200/60 inline-block mb-1">
                {scholarship.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {scholarship.title}
              </h3>
            </div>
          </div>

          {isRecommended && (
            <span className="shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" /> Potentially Eligible
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Key Indicators Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-4">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Target Level</span>
            <span className="font-bold text-slate-800 truncate block mt-0.5">{scholarship.education_level}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Benefit Grant</span>
            <span className="font-bold text-emerald-700 truncate block mt-0.5">{scholarship.max_amount}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Income Limit</span>
            <span className="font-medium text-slate-700 truncate block mt-0.5">
              {criteria.maxFamilyIncome ? `≤ ₹${(criteria.maxFamilyIncome / 100000).toFixed(1)} Lakhs` : 'No Limit'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Deadline</span>
            <span className="font-semibold text-amber-700 truncate block mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {scholarship.deadline}
            </span>
          </div>
        </div>

        {/* Required Documents preview */}
        {documents.length > 0 && (
          <div className="mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Required Documents
            </span>
            <div className="flex flex-wrap gap-1">
              {documents.slice(0, 3).map((doc, idx) => (
                <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                  {doc}
                </span>
              ))}
              {documents.length > 3 && (
                <span className="text-[11px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-semibold">
                  +{documents.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-slate-50/60 border-t border-slate-100 rounded-b-2xl flex items-center justify-between gap-2">
        <button
          onClick={() => onSelectDetails && onSelectDetails(scholarship)}
          className="text-xs font-bold text-slate-700 hover:text-primary-700 px-3 py-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all"
        >
          View Details
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/eligibility?scheme=${scholarship.id}`}
            className="text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-2 rounded-xl transition-all"
          >
            Check Eligibility
          </Link>

          <Link
            to={`/apply?scheme=${scholarship.id}`}
            className="text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1"
          >
            <span>Apply</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
