import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  User,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'officer' ? 'officer' : 'student';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('tab') === 'officer') {
      setActiveTab('officer');
    }
  }, [searchParams]);

  // Handle 1-click Demo auto fill
  const handleQuickFill = (roleType) => {
    if (roleType === 'student') {
      setActiveTab('student');
      setIdentifier('student@trinex.demo');
      setPassword('DemoStudent@123');
    } else {
      setActiveTab('officer');
      setIdentifier('officer@trinex.demo');
      setPassword('DemoOfficer@123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide your login credentials.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await login(identifier.trim(), password, activeTab);
      if (res.success) {
        if (res.user.role === 'officer' || res.user.role === 'admin') {
          navigate('/officer');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Email or password is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-indigo-950 p-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white font-extrabold text-xl shadow-md mb-2">
            TX
          </div>
          <h2 className="text-xl font-bold tracking-tight">Welcome to TRINEX</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {activeTab === 'student'
              ? 'Login securely to access your scholarship dashboard.'
              : 'Authorized Officer Access — Welfare Scrutiny Portal'}
          </p>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-white/10 rounded-xl mt-4 text-xs font-bold border border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'student'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('officer');
                setError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'officer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Officer Login</span>
            </button>
          </div>
        </div>

        {/* 1-Click Demo Evaluator helper */}
        <div className="bg-blue-50/80 border-b border-blue-100 p-3 px-6 flex items-center justify-between text-xs">
          <span className="font-semibold text-primary-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            <span>Fill Demo Credentials:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              className="px-2 py-0.5 rounded bg-primary-600 hover:bg-primary-700 text-white font-bold text-[10px] transition-colors shadow-xs"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('officer')}
              className="px-2 py-0.5 rounded bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-[10px] transition-colors shadow-xs"
            >
              Demo Officer
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {activeTab === 'student' ? 'Email Address or Mobile Number' : 'Official Officer Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={activeTab === 'student' ? 'student@trinex.demo or mobile' : 'officer@trinex.demo'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => alert('For this demo, please use DemoStudent@123 or DemoOfficer@123.')}
                className="text-[11px] font-semibold text-primary-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-500 rounded-xl outline-none transition-all text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span>Remember Me</span>
            </label>
            <span className="text-[10px] text-slate-400">Encrypted 256-bit JWT Session</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{activeTab === 'student' ? 'Login to Dashboard' : 'Authorized Officer Login'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        {activeTab === 'student' ? (
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary-700 hover:underline">
              Create Student Account
            </Link>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
            Official State / Central Welfare Nodal Officer access only.
          </div>
        )}
      </div>
    </div>
  );
};
