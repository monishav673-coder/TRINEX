import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  FileText,
  FolderLock,
  Bot,
  User,
  LayoutDashboard,
  SearchCheck,
  CreditCard
} from 'lucide-react';

export const BottomNav = () => {
  const { isOfficer } = useAuth();
  const location = useLocation();

  const studentNavItems = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/applications', label: 'Applications', icon: FileText },
    { to: '/digivault', label: 'Documents', icon: FolderLock },
    { to: '/jago', label: 'JAGO', icon: Bot, isSpecial: true },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  const officerNavItems = [
    { to: '/officer', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/officer/applications', label: 'Applications', icon: FileText },
    { to: '/officer/manual-review', label: 'Review', icon: SearchCheck },
    { to: '/officer/payments', label: 'Payments', icon: CreditCard },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  const items = isOfficer ? officerNavItems : studentNavItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[11px] font-semibold transition-all ${
                isActive
                  ? item.isSpecial
                    ? 'text-purple-600 font-bold scale-105'
                    : 'text-primary-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-lg mb-0.5 transition-all ${
                  isActive
                    ? item.isSpecial
                      ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-300'
                      : 'bg-primary-50 text-primary-600 ring-2 ring-primary-200'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="truncate max-w-[64px]">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
