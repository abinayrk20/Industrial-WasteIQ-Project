import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Factory,
  ShieldCheck,
  HardHat,
  Eye,
  LogOut,
  Clock,
  ShieldAlert
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          icon: ShieldCheck,
          label: 'ADMINISTRATOR',
          className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        };
      case 'OPERATOR':
        return {
          icon: HardHat,
          label: 'OPERATOR',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'CLIENT_VIEWER':
        return {
          icon: Eye,
          label: 'CLIENT (READ ONLY)',
          className: 'bg-sky-100 text-sky-800 border-sky-200',
        };
      default:
        return {
          icon: ShieldAlert,
          label: role,
          className: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const badge = getRoleBadge(user?.role);
  const BadgeIcon = badge.icon;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 py-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-emerald-400 p-2 rounded-xl shadow-xs border border-slate-700">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                Industrial PM
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                RBAC v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Role-Based Operations & Client Governance</p>
          </div>
        </div>

        {/* User Identity & Actions */}
        <div className="flex items-center gap-4">
          {/* Operator ID Badge if Operator */}
          {user?.operator_id && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-mono text-xs font-bold shadow-xs">
              <HardHat className="w-3.5 h-3.5 text-emerald-600" />
              <span>{user.operator_id}</span>
            </div>
          )}

          {/* Role Clearance Pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider ${badge.className}`}>
            <BadgeIcon className="w-3 h-3" />
            <span>{badge.label}</span>
          </div>

          {/* Profile Details */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-mono block">{user?.email}</span>
            </div>

            <button
              onClick={logout}
              title="Logout from session"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors border border-transparent hover:border-rose-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
