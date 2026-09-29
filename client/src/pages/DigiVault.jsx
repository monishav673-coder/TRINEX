import React, { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { DocumentCard } from '../components/DocumentCard';
import {
  FolderLock,
  Upload,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  FileText,
  X,
  Eye,
  Info,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const DigiVault = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null);
  const [syncingDigiLocker, setSyncingDigiLocker] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  const [uploadData, setUploadData] = useState({
    documentType: 'ST Certificate',
    expiryDate: 'Lifetime',
    file: null
  });

  const categories = [
    'ALL',
    'Identity Document',
    'ST Certificate',
    'PVTG Certificate',
    'Income Certificate',
    'Domicile Certificate',
    'Marksheet',
    'Disability Certificate',
    'Institution Certificate',
    'NET/JRF Certificate',
    'Other Documents'
  ];

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const res = await documentService.getAll();
      if (res.success) {
        setDocuments(res.documents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDigiLockerSync = async () => {
    setSyncingDigiLocker(true);
    try {
      const res = await documentService.syncDigiLocker();
      if (res.success) {
        setSyncSuccessMsg(res.message);
        loadDocs();
        setTimeout(() => setSyncSuccessMsg(''), 4000);
      }
    } catch (e) {
      alert('DigiLocker sync failed.');
    } finally {
      setSyncingDigiLocker(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this document from DigiVault?')) return;
    try {
      const res = await documentService.delete(id);
      if (res.success) {
        setDocuments(prev => prev.filter(d => d.id !== id));
      }
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('documentType', uploadData.documentType);
    formData.append('expiryDate', uploadData.expiryDate || 'Lifetime');
    if (uploadData.file) {
      formData.append('file', uploadData.file);
    }

    try {
      const res = await documentService.upload(formData);
      if (res.success) {
        setShowUploadModal(false);
        setUploadData({ documentType: 'ST Certificate', expiryDate: 'Lifetime', file: null });
        loadDocs();
      }
    } catch (e) {
      alert('Upload failed: ' + e.message);
    }
  };

  const filteredDocs = documents.filter(d => {
    if (selectedCategory === 'ALL') return true;
    return d.document_type === selectedCategory;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-navy-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-teal-400/20 text-teal-200 border border-teal-400/30 px-2.5 py-0.5 rounded-full font-bold">
              Secure Document Wallet
            </span>
            <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded">
              DigiLocker Sandbox Interfaced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            DigiVault
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl mt-1 leading-relaxed">
            "Your scholarship documents, organized in one secure place." Store ST certificates, income proofs, and marksheets once and reuse them for every scholarship application.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleDigiLockerSync}
            disabled={syncingDigiLocker}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncingDigiLocker ? 'animate-spin' : ''}`} />
            <span>{syncingDigiLocker ? 'Syncing...' : 'Connect DigiLocker'}</span>
            <span className="text-[10px] bg-teal-800/80 px-1 rounded font-mono">Sandbox</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* Categories Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-subtle flex items-center gap-1.5 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-3">
              <div className="w-1/3 h-4 bg-slate-200 rounded" />
              <div className="w-full h-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <FolderLock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No documents under this category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click "Upload Document" to add your certificate or click "Connect DigiLocker" to pull verified demo records.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={(d) => setShowViewModal(d)}
              onReplace={(d) => {
                setUploadData({ documentType: d.document_type, expiryDate: d.expiry_date, file: null });
                setShowUploadModal(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-5 bg-teal-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Save Document to DigiVault</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Category *</label>
                <select
                  value={uploadData.documentType}
                  onChange={(e) => setUploadData({ ...uploadData, documentType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  {categories.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Validity / Expiry Date</label>
                <input
                  type="text"
                  placeholder="e.g. Lifetime or YYYY-MM-DD"
                  value={uploadData.expiryDate}
                  onChange={(e) => setUploadData({ ...uploadData, expiryDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select File (PDF, JPG, PNG)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Maximum file size: 10MB</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-600 rounded-xl shadow-sm"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase">{showViewModal.document_type}</span>
                <h3 className="font-bold text-sm text-slate-900">{showViewModal.file_name}</h3>
              </div>
              <button onClick={() => setShowViewModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200 space-y-2">
              <FileText className="w-16 h-16 text-teal-600 mx-auto" />
              <p className="font-bold text-slate-800 text-xs">{showViewModal.file_name}</p>
              <p className="text-[11px] text-slate-500">
                Verification Status: <span className="font-bold text-emerald-700">{showViewModal.verification_status}</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Document authenticated and digitally sealed in TRINEX DigiVault sandbox.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowViewModal(null)}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
