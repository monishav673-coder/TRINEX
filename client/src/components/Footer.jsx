import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, BookOpen, ExternalLink, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                TX
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">TRINEX</span>
            </div>
            <p className="text-slate-300 font-medium">
              Tribal Integrated Next-Generation Scholarship Ecosystem
            </p>
            <p className="text-primary-400 font-semibold italic text-xs">
              "One Platform. Every Scholarship. Smarter Access."
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A unified digital window empowering Scheduled Tribe scholars across India to discover central and state schemes, store verified digital credentials in DigiVault, track multi-level scrutiny in VeriCore, and receive direct DBT grants into Aadhaar-seeded accounts.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Prototype / Demo Environment
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">Key Modules</h4>
            <ul className="space-y-1.5">
              <li><Link to="/scholarships" className="hover:text-white transition-colors">Scholarship Hub</Link></li>
              <li><Link to="/eligibility" className="hover:text-white transition-colors">Eligibility Checker</Link></li>
              <li><Link to="/digivault" className="hover:text-white transition-colors">DigiVault Wallet</Link></li>
              <li><Link to="/vericore" className="hover:text-white transition-colors">VeriCore Verification</Link></li>
              <li><Link to="/fundtrack" className="hover:text-white transition-colors">FundTrack DBT Portal</Link></li>
              <li><Link to="/jago" className="hover:text-white transition-colors text-purple-400">JAGO AI Assistant</Link></li>
            </ul>
          </div>

          {/* Official Reference Framework */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">Official Frameworks</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Designed around official guidelines of the Ministry of Tribal Affairs (MoTA), Direct Benefit Transfer (DBT) Bharat, National Scholarship Portal (NSP), and DigiLocker.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              <p>Disclaimer: Simulated sandbox environment for demonstration. No real sensitive Aadhaar or banking data is collected or transmitted.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 TRINEX Ecosystem. Built for inclusive tribal education advancement.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-slate-300">Help & FAQs</Link>
            <span>•</span>
            <span className="text-slate-400">Version 2.6.4 Demo Build</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
