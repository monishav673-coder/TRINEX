import React from 'react';
import { Check, Clock, AlertTriangle, Circle } from 'lucide-react';

export const ProgressTracker = ({ currentStatus, timelineData = [], orientation = 'horizontal' }) => {
  const stages = [
    { key: 'Submitted', label: 'Submitted' },
    { key: 'Document Verification', label: 'Document Verification' },
    { key: 'Institution Verification', label: 'Institution Verification' },
    { key: 'Department Verification', label: 'Department Verification' },
    { key: 'Sanction', label: 'Sanction' },
    { key: 'Disbursement', label: 'Disbursement' }
  ];

  // Map status to progress index
  const getStageIndex = (status) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'Document Verification': return 1;
      case 'Institution Verification': return 2;
      case 'Department Verification': return 3;
      case 'Manual Review Required':
      case 'Clarification Required':
      case 'Action Required': return 3; // review during dept verification
      case 'Sanctioned': return 4;
      case 'Disbursement':
      case 'Completed': return 5;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);
  const isReviewActive = ['Manual Review Required', 'Clarification Required', 'Action Required'].includes(currentStatus);

  if (orientation === 'vertical') {
    return (
      <div className="space-y-6 relative pl-2">
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && currentStatus === 'Completed');
          const isCurrent = idx === currentIndex && currentStatus !== 'Completed';
          const isPending = idx > currentIndex;

          return (
            <div key={stage.key} className="flex items-start gap-4 relative">
              {idx < stages.length - 1 && (
                <div
                  className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                    idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : isCurrent
                    ? isReviewActive && stage.key === 'Department Verification'
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-primary-600 text-white ring-4 ring-primary-100 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isCurrent ? (
                  isReviewActive ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                )}
              </div>

              <div className="pt-0.5">
                <p className={`text-sm font-semibold ${isCurrent ? 'text-slate-900' : isCompleted ? 'text-emerald-800' : 'text-slate-500'}`}>
                  {stage.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isCompleted ? 'Completed' : isCurrent ? (isReviewActive ? 'Manual Review Active' : 'In Progress') : 'Pending'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal Timeline
  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="min-w-[620px] flex items-center justify-between relative px-4">
        {/* Connecting bar */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
          style={{ width: `${(Math.min(currentIndex, 5) / (stages.length - 1)) * 100}%` }}
        />

        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIndex || (idx === currentIndex && currentStatus === 'Completed');
          const isCurrent = idx === currentIndex && currentStatus !== 'Completed';
          const isPending = idx > currentIndex;

          return (
            <div key={stage.key} className="flex flex-col items-center relative z-10 group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isCurrent
                    ? isReviewActive && stage.key === 'Department Verification'
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-md'
                      : 'bg-primary-600 text-white ring-4 ring-primary-100 shadow-md animate-pulse'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : isCurrent ? (
                  isReviewActive ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  )
                ) : (
                  <Circle className="w-2.5 h-2.5 text-slate-300" />
                )}
              </div>

              <div className="text-center mt-2">
                <p className={`text-xs font-bold whitespace-nowrap ${isCurrent ? 'text-primary-800' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {stage.label}
                </p>
                <span className={`text-[10px] font-medium block ${isCurrent ? 'text-primary-600 font-semibold' : 'text-slate-400'}`}>
                  {isCompleted ? '✓ Done' : isCurrent ? (isReviewActive ? '● In Review' : '● Current') : '○ Upcoming'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
