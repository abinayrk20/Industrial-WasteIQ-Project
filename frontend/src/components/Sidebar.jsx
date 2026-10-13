import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  CheckSquare,
  ClipboardList,
  FolderLock,
  FileCheck,
  ShieldCheck,
  HardHat,
  Eye,
  Activity,
  Download
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'CLIENT_VIEWER';

  const adminNav = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Operator Management', path: '/admin/operators', icon: Users },
    { name: 'Projects & Sites', path: '/admin/projects', icon: Briefcase },
    { name: 'Approvals & Reports', path: '/admin/reports', icon: FileCheck },
    { name: 'System Settings & Logs', path: '/admin/settings', icon: Settings },
  ];

  const operatorNav = [
    { name: 'Operator Station', path: '/operator/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Tasks', path: '/operator/tasks', icon: CheckSquare },
    { name: 'Daily Activity Logs', path: '/operator/records', icon: ClipboardList },
    { name: 'Personal Reports', path: '/operator/reports', icon: FileText },
  ];

  const clientNav = [
    { name: 'Client Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Approved Progress Reports', path: '/client/reports', icon: FileText },
    { name: 'Permitted Documents', path: '/client/documents', icon: FolderLock },
  ];

  const currentNav = role === 'ADMIN' ? adminNav : role === 'OPERATOR' ? operatorNav : clientNav;

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 min-h-[calc(100vh-61px)] flex flex-col justify-between p-4 border-r border-slate-800/90 shadow-2xl font-['Plus_Jakarta_Sans',sans-serif]">
      <div>
        {/* Clearance Header */}
        <div className="px-3.5 py-3 mb-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400">
              {role === 'ADMIN' ? 'Tier-1 Executive' : role === 'OPERATOR' ? 'Field Station' : 'Stakeholder'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs font-extrabold text-white mt-1">
            {role === 'ADMIN' ? 'Master Control Hub' : role === 'OPERATOR' ? 'Operator Terminal' : 'View-Only Console'}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-950/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry & Download Card */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
        <a
          href="https://github.com/abinayrk20/Industrial-WasteIQ-Project/archive/refs/heads/main.zip"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Project ZIP</span>
        </a>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
          <span>WASTE-IQ PROTOCOL</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
