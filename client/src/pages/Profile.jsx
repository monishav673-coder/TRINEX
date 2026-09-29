import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Edit3,
  X,
  Sparkles,
  Award,
  CreditCard,
  Save
} from 'lucide-react';

export const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(user?.profile || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      if (res.success && res.profile) {
        setProfile(res.profile);
        setEditData(res.profile);
      }
    } catch (e) {
      console.warn('Profile fetch note:', e.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/student/profile', editData);
      if (res.success) {
        setProfile(res.profile);
        setSuccessMsg('Profile updated successfully.');
        setIsEditing(false);
        refreshProfile();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const completionPct = profile?.profile_completion || 85;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-primary-900/20 shrink-0">
            {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.fullName || 'Ananya Kumar'}</h1>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ST Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Student ID: {profile?.student_id || user?.studentId || 'TRX-ST-10024'}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {profile?.institution || 'Government Autonomous College, Rourkela'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditData(profile || {});
              setIsEditing(true);
            }}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Completion & Demographic Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detailed Information Tabs */}
        <div className="md:col-span-2 space-y-6">
          {/* Academic Information */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary-600" />
              <span>Academic & Institution Records</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Institution</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{profile?.institution || 'Government Autonomous College, Rourkela'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course / Major</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{profile?.course || 'B.Tech in Computer Science'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Year of Study</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{profile?.year_of_study || '3rd Year'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Academic Score</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">{profile?.academic_percentage || '84.5'}%</span>
              </div>
            </div>
          </div>

          {/* Demographic & Category Information */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Tribal & Financial Parameters</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ST Community Status</span>
                <span className="font-bold text-slate-800 mt-0.5 block">Scheduled Tribe (ST - Odisha)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PVTG Status</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{profile?.pvtg_status || 'No'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Annual Family Income</span>
                <span className="font-mono font-bold text-slate-900 mt-0.5 block">₹{Number(profile?.family_income || 150000).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Domicile State & District</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{profile?.district || 'Mayurbhanj'}, {profile?.state || 'Odisha'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Profile Completion & DBT Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Profile Completion</h3>
            <div className="text-center py-2">
              <span className="text-4xl font-extrabold text-primary-700 font-mono">{completionPct}%</span>
              <p className="text-xs text-slate-500 mt-1">Verified Profile Score</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Your profile is verified with DigiVault credentials. All 5 central tribal schemes can read directly from this profile.
            </p>
          </div>

          <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 space-y-3 text-xs">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>Aadhaar DBT Bank Status</span>
            </h4>
            <p className="text-emerald-900">
              Account: <strong className="font-mono">XXXX-XXXX-4821</strong>
            </p>
            <p className="text-emerald-900">
              Bank: <strong>State Bank of India (Masked)</strong>
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> NPCI Aadhaar Seeded
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Edit Student Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Institution</label>
                <input
                  type="text"
                  name="institution"
                  value={editData.institution || ''}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Course</label>
                  <input
                    type="text"
                    name="course"
                    value={editData.course || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year of Study</label>
                  <input
                    type="text"
                    name="year_of_study"
                    value={editData.year_of_study || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={editData.district || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual Income (₹)</label>
                  <input
                    type="number"
                    name="family_income"
                    value={editData.family_income || ''}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
