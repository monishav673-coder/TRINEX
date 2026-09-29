import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  CheckCheck,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifs();
  }, []);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await notificationService.markRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: 1 } : n));
      } catch (e) {
        console.error(e);
      }
    }
    if (notif.action_url) {
      navigate(notif.action_url);
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.is_read;
    if (filter === 'WARNING') return n.type === 'WARNING';
    if (filter === 'PAYMENT') return n.type === 'PAYMENT';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200">
            Real-Time Updates
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stay informed on document validations, institutional bonafide approvals, and payment dispatches.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-primary-700 hover:text-primary-800 hover:bg-primary-50 px-3.5 py-2 rounded-xl border border-primary-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { key: 'ALL', label: 'All Notifications' },
          { key: 'UNREAD', label: 'Unread' },
          { key: 'WARNING', label: 'Action Required' },
          { key: 'PAYMENT', label: 'Payments' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === tab.key
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No notifications found</h3>
          <p className="text-xs text-slate-500 mt-1">You're all caught up with your scholarship updates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`bg-white rounded-2xl border p-4 shadow-subtle hover:shadow-card-hover transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                !notif.is_read ? 'border-primary-200 bg-blue-50/20 ring-1 ring-primary-100' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  notif.type === 'SUCCESS'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : notif.type === 'WARNING'
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : notif.type === 'PAYMENT'
                    ? 'bg-teal-50 text-teal-600 border-teal-200'
                    : 'bg-blue-50 text-primary-600 border-blue-200'
                }`}>
                  {notif.type === 'SUCCESS' && <CheckCircle2 className="w-5 h-5" />}
                  {notif.type === 'WARNING' && <AlertTriangle className="w-5 h-5" />}
                  {notif.type === 'PAYMENT' && <CreditCard className="w-5 h-5" />}
                  {(!notif.type || notif.type === 'INFO') && <Bell className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs font-bold ${!notif.is_read ? 'text-primary-950 font-extrabold' : 'text-slate-900'}`}>
                      {notif.title}
                    </h4>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block font-mono">{notif.created_at}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-transform shrink-0 mt-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
