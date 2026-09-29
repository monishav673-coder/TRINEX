import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  FileText,
  ShieldCheck,
  CreditCard,
  FolderLock,
  Bot,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const HelpSupport = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'What makes TRINEX different from traditional scholarship portals?',
      a: 'TRINEX unites all central and state tribal scholarship schemes into a single digital window. By leveraging DigiVault, you store your community and income credentials once and reuse them. Automated verifications in VeriCore never automatically reject applications upon a mismatch; they route directly to authorized officer manual review.'
    },
    {
      q: 'What should I do if a mismatch is detected during verification?',
      a: 'If a mismatch is flagged (for example, between gross and net income values), your application is safe. You can navigate to VeriCore and click "Submit Clarification" to provide supplementary details or an updated document without starting over.'
    },
    {
      q: 'Are my scholarships disbursed directly to my bank account?',
      a: 'Yes. Under the Direct Benefit Transfer (DBT) framework, sanctioned funds are credited directly to your Aadhaar-seeded bank account through the Public Financial Management System (PFMS).'
    },
    {
      q: 'How does JAGO AI assist me during my application?',
      a: 'JAGO AI is context-aware. When you ask questions like "Why is my application pending?" or "What documents are missing?", JAGO evaluates your active application state and explains the exact stage and any required actions in 6 regional languages.'
    },
    {
      q: 'What are the official income limits for tribal scholarship schemes?',
      a: 'For Pre-Matric and Post-Matric scholarships for ST students, the parental income ceiling is ₹2.50 Lakhs per annum. For Top Class Education in premier institutes, it is ₹6.00 Lakhs per annum. National Fellowships (NFST) have no income ceiling, while the National Overseas Scholarship (NOS) ceiling is ₹8.00 Lakhs per annum.'
    }
  ];

  const helpTopics = [
    { title: 'Application Help', icon: FileText, desc: 'Step-by-step guidance on filling the 8-step wizard.' },
    { title: 'DigiVault Guide', icon: FolderLock, desc: 'Connecting DigiLocker & managing digital certificates.' },
    { title: 'VeriCore Scrutiny', icon: ShieldCheck, desc: 'Understanding automated checks & manual review.' },
    { title: 'Payment Help', icon: CreditCard, desc: 'Aadhaar bank seeding and PFMS DBT tracking.' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs bg-white/10 text-primary-200 border border-white/10 px-2.5 py-0.5 rounded-full font-bold">
            Scholar Support Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Help & Knowledge Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Find answers to frequently asked questions, guidelines, grievance escalation, or speak with JAGO AI.
          </p>
        </div>

        <Link
          to="/jago"
          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Bot className="w-4 h-4" />
          <span>Ask JAGO AI</span>
        </Link>
      </div>

      {/* Help Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpTopics.map((topic, idx) => {
          const Icon = topic.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle hover:shadow-card-hover transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center mb-3 border border-blue-100">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">{topic.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{topic.desc}</p>
            </div>
          );
        })}
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="p-4 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Statutory Compliance Disclaimer:</strong> Official scheme rules, monetary allocations, and eligibility conditions must always be verified against the latest applicable guidelines issued by the Ministry of Tribal Affairs (MoTA) and State Tribal Welfare Departments.
        </p>
      </div>
    </div>
  );
};
