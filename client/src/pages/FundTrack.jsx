import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { StatusBadge } from '../components/StatusBadge';
import {
  CreditCard,
  IndianRupee,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';

export const FundTrack = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAll();
      if (res.success) {
        setPaymentData(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const paymentStages = [
    { key: 'Sanctioned', label: 'Sanctioned', desc: 'Ministry financial sanction order generated' },
    { key: 'Processing', label: 'Processing', desc: 'PFMS DBT electronic batch processing' },
    { key: 'Transferred', label: 'Transferred', desc: 'NPCI Aadhaar Payment Bridge dispatch' },
    { key: 'Completed', label: 'Completed', desc: 'Direct credit confirmed by beneficiary bank' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-navy-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
              Direct Benefit Transfer (DBT)
            </span>
            <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded">
              Aadhaar-Seeded Bank Clearing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            FundTrack
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mt-1 leading-relaxed">
            "Track scholarship sanction and disbursement status." Direct monitoring of treasury orders, PFMS batch processing, and bank account credit confirmation.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-right shrink-0">
          <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">Total Sanctioned Grant</span>
          <span className="text-2xl font-extrabold text-white font-mono">₹38,000</span>
          <span className="text-[10px] text-emerald-300 block mt-0.5">2026-27 Academic Cycle</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sanctioned Amount</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">₹38,000</h3>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Approved by Dept
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disbursed Amount</span>
          <h3 className="text-2xl font-extrabold text-teal-700 mt-1 font-mono">₹0</h3>
          <span className="text-[10px] text-slate-500">In Banking Pipeline</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Release</span>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">₹38,000</h3>
          <span className="text-[10px] text-amber-600 font-medium">Batch PFMS-9482</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Status</span>
          <h3 className="text-xl font-extrabold text-primary-700 mt-1">Processing</h3>
          <span className="text-[10px] text-slate-500 font-mono">Ref: TXN-DBT-94827104</span>
        </div>
      </div>

      {/* Active Disbursement Tracker Card */}
      {paymentData?.payments && paymentData.payments.length > 0 ? (
        paymentData.payments.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold font-mono text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-200">
                    Application: {p.application_no}
                  </span>
                  <span className="text-xs text-slate-500">{p.scholarship_title}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Electronic Direct Benefit Transfer (DBT) Schedule
                </h3>
              </div>

              <StatusBadge status={p.payment_status} size="lg" />
            </div>

            {/* 4-Stage Payment Timeline Bar */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                4-Stage DBT Transfer Progression
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {paymentStages.map((stage, idx) => {
                  const isDone = idx === 0; // Sanctioned is done
                  const isCurrent = idx === 1; // Processing is current
                  const isPending = idx > 1;

                  return (
                    <div
                      key={stage.key}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                          : isCurrent
                          ? 'bg-primary-50/80 border-primary-300 text-primary-950 ring-2 ring-primary-100'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold font-mono">Stage 0{idx + 1}</span>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isCurrent ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-ping" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                      </div>

                      <h5 className="font-bold text-sm mb-1">{stage.label}</h5>
                      <p className="text-[11px] leading-relaxed opacity-90">{stage.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Masked Bank Details & Transaction Reference */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Beneficiary Account</span>
                <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">{p.bank_account_masked}</span>
                <span className="text-[10px] text-slate-500">Aadhaar NPCI Mapped (Masked Demo)</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IFSC Code</span>
                <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">{p.ifsc_code_masked}</span>
                <span className="text-[10px] text-slate-500">State Bank of India</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PFMS Transaction ID</span>
                <span className="font-mono font-bold text-primary-700 text-sm mt-0.5 block">{p.transaction_ref}</span>
                <span className="text-[10px] text-slate-500">Fictional Reference Identifier</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No active disbursement records yet</h3>
          <p className="text-xs text-slate-500 mt-1">Once your application is sanctioned by the department, payment tracking will appear here.</p>
        </div>
      )}

      {/* Safety Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Security Notice:</strong> All bank account details and transaction IDs shown in this interface are masked fictional representations in accordance with the TRINEX prototype safety standard.
        </p>
      </div>
    </div>
  );
};
