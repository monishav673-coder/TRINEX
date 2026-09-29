import React from 'react';
import { StatusBadge } from './StatusBadge';
import {
  FileText,
  Eye,
  RefreshCw,
  Trash2,
  Calendar,
  HardDrive,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const DocumentCard = ({ document, onView, onReplace, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:shadow-card-hover transition-all p-4 flex flex-col justify-between">
      {/* Top Details */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 text-primary-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {document.document_type}
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate max-w-[190px]" title={document.file_name}>
                {document.file_name}
              </h4>
            </div>
          </div>

          <StatusBadge status={document.verification_status} size="sm" />
        </div>

        {/* Metadata info */}
        <div className="space-y-1 bg-slate-50 rounded-xl p-2.5 text-[11px] text-slate-500 border border-slate-100 my-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-slate-400" /> Size</span>
            <span className="font-semibold text-slate-700">{document.file_size || '1.2 MB'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> Validity</span>
            <span className="font-semibold text-slate-700">{document.expiry_date || 'Lifetime'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Uploaded On</span>
            <span className="font-mono text-slate-600">{document.uploaded_at ? document.uploaded_at.split(' ')[0] : '28 Sep 2026'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
        <button
          onClick={() => onView && onView(document)}
          className="flex-1 text-xs font-semibold text-primary-700 hover:text-primary-800 hover:bg-primary-50 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>

        <button
          onClick={() => onReplace && onReplace(document)}
          className="flex-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <RefreshCw className="w-3 h-3" /> Replace
        </button>

        <button
          onClick={() => onDelete && onDelete(document.id)}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Document"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
