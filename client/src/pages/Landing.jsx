import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { scholarshipService } from '../services/scholarshipService';
import { useAuth } from '../context/AuthContext';
import { ScholarshipCard } from '../components/ScholarshipCard';
import {
  Award,
  BookOpen,
  GraduationCap,
  FolderLock,
  ShieldCheck,
  CreditCard,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Building,
  Shield,
  Clock,
  Layers,
  Search,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const Landing = () => {
  const { user, isOfficer } = useAuth();
  const navigate = useNavigate();
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const res = await scholarshipService.getAll();
      if (res.success) {
        setFeaturedSchemes(res.scholarships.slice(0, 3));
      }
    } catch (e) {
      console.warn('Could not load featured scholarships');
    }
  };

  const processSteps = [
    { step: '01', title: 'Student Onboarding', desc: 'Single KYC with APAAR & ST category profiling', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { step: '02', title: 'Scholarship Discovery', desc: 'Smart AI matching for 5 premier tribal schemes', icon: Award, color: 'from-indigo-600 to-primary-700' },
    { step: '03', title: 'DigiVault Wallet', desc: 'One-time document upload & DigiLocker sync', icon: FolderLock, color: 'from-primary-700 to-teal-600' },
    { step: '04', title: 'VeriCore Verification', desc: '10 automated integration checks with manual safety', icon: ShieldCheck, color: 'from-teal-600 to-emerald-600' },
    { step: '05', title: 'Department Approval', desc: 'Transparent scrutiny without automated rejection', icon: CheckCircle2, color: 'from-emerald-600 to-amber-600' },
    { step: '06', title: 'DBT Payment', desc: 'Direct benefit credit to Aadhaar-seeded bank', icon: CreditCard, color: 'from-amber-600 to-saffron-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Demo Banner */}
      <div className="bg-amber-500 text-slate-950 text-xs py-1.5 px-4 font-bold text-center border-b border-amber-600 shadow-sm flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
        <span>Prototype / Demo Environment — Designed exclusively for Tribal Students Scholarship Access (No real data collected)</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-slate-900 to-navy-800 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-saffron-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-primary-200 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
            <span>Ministry of Tribal Affairs Ecosystem Reference Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white mb-4">
            TRINEX
          </h1>
          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-200 via-primary-300 to-indigo-200 bg-clip-text text-transparent mb-4">
            "One Platform. Every Scholarship. Smarter Access."
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover scholarships, submit applications, verify documents in DigiVault, track your scrutiny via VeriCore, and monitor direct scholarship payments from one unified platform.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-primary-900/50 hover:scale-102 transition-all flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/scholarships"
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm px-6 py-3.5 rounded-xl backdrop-blur-md transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-primary-300" />
              <span>Explore Scholarships</span>
            </Link>

            <Link
              to="/login"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm px-5 py-3.5 rounded-xl transition-all"
            >
              Student Login
            </Link>

            <Link
              to="/login?tab=officer"
              className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/50 font-bold text-sm px-5 py-3.5 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>Officer Portal</span>
            </Link>
          </div>

          {/* 1-Click Demo Account Quick Access Card */}
          <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-lg text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-saffron-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 1-Click Evaluation Credentials
              </span>
              <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded">Fictional Demo Users</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-white flex items-center gap-1">
                    <span>Student Demo</span>
                    <span className="text-[10px] bg-primary-500/20 text-primary-300 px-1 rounded">Ananya Kumar</span>
                  </p>
                  <p className="text-slate-400 text-[11px] font-mono mt-1">student@trinex.demo</p>
                  <p className="text-slate-400 text-[11px] font-mono">Password: DemoStudent@123</p>
                </div>
                <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold text-[11px] mt-2 block">
                  Click to login as Student →
                </Link>
              </div>

              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-white flex items-center gap-1">
                    <span>Officer Demo</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1 rounded">Dr. Rajesh Verma</span>
                  </p>
                  <p className="text-slate-400 text-[11px] font-mono mt-1">officer@trinex.demo</p>
                  <p className="text-slate-400 text-[11px] font-mono">Password: DemoOfficer@123</p>
                </div>
                <Link to="/login?tab=officer" className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] mt-2 block">
                  Click to login as Officer →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Diagram: Student → Scholarship → DigiVault → VeriCore → Approval → Payment */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
              End-to-End Digital Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              From Discovery to Direct Bank Disbursement
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto mt-1">
              TRINEX replaces fragmented portals with an automated, transparent, single-window scholarship lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between relative group hover:border-primary-300 hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold text-slate-400 font-mono">
                        {step.step}
                      </span>
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Why TRINEX? (4 Core Feature Cards) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider bg-saffron-50 px-2.5 py-1 rounded-full border border-saffron-200/60">
              Why TRINEX?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Overcoming the Barriers Tribal Students Face
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Tribal students often navigate multiple disconnected state and central portals, repeatedly submit identical physical certificates, track status across siloed departments, and experience uncertain payment delays. TRINEX unifies every touchpoint into one intelligent, transparent ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: One Platform */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-primary-700 flex items-center justify-center mb-4 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">One Platform</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Access pre-matric, post-matric, top class, and national fellowship opportunities through a unified digital dashboard with single sign-on.
              </p>
            </div>

            {/* Card 2: DigiVault */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-4 shadow-sm">
                <FolderLock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">DigiVault</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A dedicated student document wallet. Securely store ST community certificates, income records, and marksheets for instant reuse across all applications.
              </p>
            </div>

            {/* Card 3: VeriCore */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">VeriCore</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unified verification engine interfacing with DigiLocker, UDISE+, APAAR, and AISHE. Automatic mismatches route safely to Manual Review without rejection.
              </p>
            </div>

            {/* Card 4: JAGO AI */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-4 shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">JAGO AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Personalized AI assistance that understands your active application state, explains pending stages, suggests corrections, and speaks in 6 regional languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
                Major Scholarship Schemes
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Central Sector & Centrally Sponsored Schemes
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sourced from Ministry of Tribal Affairs guidelines for 2026-2027.
              </p>
            </div>

            <Link
              to="/scholarships"
              className="text-xs font-bold text-primary-700 hover:text-primary-800 flex items-center gap-1"
            >
              <span>View All 5 Schemes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSchemes.map((sch) => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Strip */}
      <section className="bg-navy-900 text-white py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-extrabold">Ready to Discover Your Eligible Scholarships?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Create your student profile in 4 simple steps and let TRINEX match you to authorized educational grants.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
            >
              Create Student Account
            </Link>
            <Link
              to="/eligibility"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-xl border border-white/20 transition-all"
            >
              Try Eligibility Checker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
