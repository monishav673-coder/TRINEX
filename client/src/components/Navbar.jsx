import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { notificationService } from '../services/notificationService';
import {
  Search,
  Bell,
  Globe,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isOfficer, isStudent } = useAuth();
  const { currentLang, changeLanguage, languageNames, t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      if (res.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to load navbar notifications');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-subtle">
      {/* Demo Sandbox Alert Ribbon */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-navy-900 text-white text-[11px] py-1 px-4 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
            Prototype / Demo Environment
          </span>
          <span className="hidden sm:inline text-slate-300">
            TRINEX — Unified Tribal Scholarship Architecture • Mock Sandbox Integrations Active
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span className="hidden md:inline">2026-2027 Academic Cycle</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> System Live
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Brand & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <Link to={user ? (isOfficer ? '/officer' : '/dashboard') : '/'} className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-indigo-800 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              TX
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">TRINEX</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-primary-500 rounded-lg outline-none transition-all text-slate-800 placeholder:text-slate-400"
            />
          </form>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-primary-600" />
              <span className="uppercase">{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Language
                </div>
                {languageNames.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-primary-50 transition-colors ${
                      currentLang === lang.code ? 'font-bold text-primary-700 bg-primary-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {currentLang === lang.code && <span className="text-primary-600 text-[10px]">●</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-primary-700 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-saffron-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900">Notifications ({notifications.length})</h4>
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifMenu(false)}
                        className="text-xs text-primary-600 font-semibold hover:underline"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                      ) : (
                        notifications.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              setShowNotifMenu(false);
                              if (n.action_url) navigate(n.action_url);
                            }}
                            className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors flex gap-2.5 ${
                              !n.is_read ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {n.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              {n.type === 'WARNING' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                              {n.type === 'PAYMENT' && <span className="text-xs">💰</span>}
                              {(!n.type || n.type === 'INFO') && <Bell className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{n.title}</p>
                              <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{n.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user.fullName || 'User'}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      {user.studentId && (
                        <p className="text-[10px] font-mono font-semibold text-primary-700 mt-1 bg-primary-100/60 px-1.5 py-0.5 rounded inline-block">
                          ID: {user.studentId}
                        </p>
                      )}
                    </div>

                    <Link
                      to={isOfficer ? '/officer/profile' : '/profile'}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>

                    {isStudent && (
                      <Link
                        to="/jago"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-jago-600 hover:bg-purple-50 transition-colors font-medium"
                      >
                        <Sparkles className="w-4 h-4" /> Ask JAGO AI
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold text-primary-700 hover:text-primary-800 px-3 py-1.5 rounded-lg border border-primary-200 hover:bg-primary-50 transition-all"
              >
                {t('studentLogin')}
              </Link>
              <Link
                to="/login?tab=officer"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all hidden sm:inline-flex items-center gap-1"
              >
                <Shield className="w-3 h-3 text-slate-500" />
                {t('officerLogin')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
