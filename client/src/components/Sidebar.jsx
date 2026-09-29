import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Award,
  CheckSquare,
  FileText,
  FolderLock,
  ShieldCheck,
  CreditCard,
  Bell,
  Bot,
  User,
  HelpCircle,
  Users,
  SearchCheck,
  BarChart3,
  ScrollText,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isOfficer } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/scholarships', icon: Award, label: t('scholarships') },
    { to: '/eligibility', icon: CheckSquare, label: t('eligibility') },
    { to: '/applications', icon: FileText, label: t('applications') },
    { to: '/digivault', icon: FolderLock, label: t('digivault'), badge: 'Wallet' },
    { to: '/vericore', icon: ShieldCheck, label: t('vericore'), badge: 'Sandbox' },
    { to: '/fundtrack', icon: CreditCard, label: t('fundtrack') },
    { to: '/notifications', icon: Bell, label: t('notifications') },
    { to: '/jago', icon: Bot, label: t('jago'), isSpecial: true },
    { to: '/profile', icon: User, label: t('profile') },
    { to: '/help', icon: HelpCircle, label: t('help') }
  ];

  const officerLinks = [
    { to: '/officer', icon: LayoutDashboard, label: 'Officer Dashboard' },
    { to: '/officer/applications', icon: FileText, label: 'All Applications' },
    { to: '/officer/manual-review', icon: SearchCheck, label: 'Manual Review', badge: 'Action' },
    { to: '/officer/beneficiary-insight', icon: Users, label: 'Beneficiary Insight' },
    { to: '/officer/payments', icon: CreditCard, label: 'Payment Dispatch' },
    { to: '/officer/reports', icon: BarChart3, label: 'Reports & Analytics' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/officer/audit-logs', icon: ScrollText, label: 'Audit Logs' },
    { to: '/profile', icon: User, label: 'Officer Profile' }
  ];

  const links = isOfficer ? officerLinks : studentLinks;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none min-h-[calc(100vh-4rem)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-lg shadow-glow-blue">
          TX
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-white text-base tracking-wider">TRINEX</h1>
            <span className="text-[10px] bg-primary-500/20 text-primary-300 border border-primary-500/30 px-1 py-0.2 rounded font-mono">v2.6</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-tight line-clamp-1">
            Tribal Scholarship Ecosystem
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
          {isOfficer ? 'Officer Command Center' : 'Student Portal'}
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-900/40'
                  : link.isSpecial
                  ? 'text-purple-300 hover:bg-purple-950/40 hover:text-purple-200 border border-purple-800/40 bg-purple-950/20'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-white'
                      : link.isSpecial
                      ? 'text-purple-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{link.label}</span>
              </div>

              {link.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : link.badge === 'Action'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {link.badge}
                </span>
              )}

              {link.isSpecial && !isActive && (
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* JAGO Quick Helper banner for Student */}
      {!isOfficer && (
        <div className="p-3.5 m-3 rounded-xl bg-gradient-to-br from-purple-900/40 to-indigo-950/60 border border-purple-700/30 text-xs">
          <div className="flex items-center gap-2 text-purple-200 font-bold mb-1">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Need Help? Ask JAGO</span>
          </div>
          <p className="text-[11px] text-purple-300/80 mb-2">
            Context-aware scholarship guidance in 6 languages.
          </p>
          <NavLink
            to="/jago"
            className="flex items-center justify-between bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <span>Launch JAGO AI</span>
            <ChevronRight className="w-3 h-3" />
          </NavLink>
        </div>
      )}

      {/* System Status footer */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="truncate">Connected: MoTA Central Hub</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Operational" />
      </div>
    </aside>
  );
};
