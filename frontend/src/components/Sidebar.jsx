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
  Download,
  Sparkles,
  Recycle
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
    <aside className="w-64 bg-[#030806]/95 backdrop-blur-2xl text-slate-300 min-h-[calc(100vh-61px)] flex flex-col justify-between p-4 border-r border-[#39FF78]/15 shadow-2xl font-['Plus_Jakarta_Sans',sans-serif]">
      <div>
        {/* Clearance Header Badge */}
        <div className="px-3.5 py-3 mb-4 rounded-2xl bg-gradient-to-br from-[#0B1210] to-[#063D28]/40 border border-[#39FF78]/25 shadow-lg shadow-[#030806]/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#39FF78] flex items-center gap-1.5">
              <Recycle className="w-3 h-3 text-[#39FF78] animate-spin-slow" />
              {role === 'ADMIN' ? 'Tier-1 Executive' : role === 'OPERATOR' ? 'Field Station' : 'Stakeholder'}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#39FF78] animate-ping" />
          </div>
          <p className="text-xs font-black text-[#F4FFF7] mt-1 tracking-tight">
            {role === 'ADMIN' ? 'WasteIQ Master Hub' : role === 'OPERATOR' ? 'Waste Operator Terminal' : 'Sustainability Console'}
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
                      ? 'bg-gradient-to-r from-[#39FF78]/20 via-[#00A86B]/15 to-transparent text-[#39FF78] border border-[#39FF78]/40 shadow-lg shadow-[#39FF78]/10'
                      : 'text-slate-400 hover:text-[#F4FFF7] hover:bg-[#0B1210]/90 border border-transparent hover:border-[#39FF78]/15'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#39FF78]' : 'text-slate-400 group-hover:text-[#39FF78]'
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
      <div className="mt-6 pt-4 border-t border-[#39FF78]/15 space-y-3">
        <a
          href="/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#063D28]/80 to-[#0B1210] hover:from-[#063D28] hover:to-[#0B1210] border border-[#39FF78]/30 text-[11px] font-bold text-[#39FF78] hover:text-[#F4FFF7] transition-all shadow-md shadow-[#030806]"
        >
          <Download className="w-3.5 h-3.5 text-[#39FF78]" />
          <span>Download Project ZIP</span>
        </a>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39FF78]"></span>
            WASTE-IQ 2026
          </span>
          <span className="text-[#39FF78] font-bold">ONLINE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
