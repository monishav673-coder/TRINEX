import React from 'react';
import { StatusBadge } from './StatusBadge';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

export const VerificationCard = ({ integration, onOpenClarification }) => {
  const isMismatch = integration.status === 'MISMATCH' || integration.status === 'PENDING_REVIEW';
  const isMatched = integration.status === 'MATCHED' || integration.status === 'VERIFIED_MANUAL';

  return (
    <div className={`bg-white rounded-2xl border transition-all p-5 shadow-subtle flex flex-col justify-between ${
      isMismatch ? 'border-amber-300 ring-2 ring-amber-100/80 bg-amber-50/10' : 'border-slate-200/90 hover:shadow-card-hover'
    }`}>
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
              isMismatch ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-50 text-primary-700 border-blue-200'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900">{integration.name}</h4>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-semibold">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{integration.type}</p>
            </div>
          </div>

          <StatusBadge status={integration.status} size="sm" />
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {integration.description}
        </p>

        {/* Verification result details */}
        <div className={`rounded-xl p-3 text-xs mb-3 border ${
          isMismatch ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-700'
        }`}>
          <div className="flex items-center justify-between mb-1 text-[11px] text-slate-500">
            <span>Last Checked</span>
            <span className="font-semibold text-slate-700">{integration.lastChecked || '28 Sep 2026'}</span>
          </div>

          {isMismatch ? (
            <div className="mt-2 space-y-1">
              <div className="flex items-start gap-1.5 text-amber-800 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>Discrepancy: {integration.mismatchReason || 'Value difference detected in revenue records.'}</span>
              </div>
              <p className="text-[11px] text-amber-700 pl-5 font-normal">
                Mismatch detected. Manual review is required (No automatic rejection).
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mt-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Record Matched with Central Directory</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Clarification Action */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Demo Sandbox</span>
        </div>

        {isMismatch && (
          <button
            onClick={() => onOpenClarification && onOpenClarification(integration)}
            className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 border border-amber-300 px-3 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1"
          >
            <span>Submit Clarification</span>
          </button>
        )}
      </div>
    </div>
  );
};
