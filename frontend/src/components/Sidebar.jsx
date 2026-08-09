import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  BarChart3, 
  Target, 
  Settings, 
  User, 
  LogOut, 
  Zap 
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'interview-setup', label: 'Interviews', icon: Video },
  { id: 'resume-upload', label: 'Resume', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'history', label: 'Practice', icon: Target },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentPage, setCurrentPage, onLogout }) {
  return (
    <aside className="w-64 bg-[#0b0f19]/90 border-r border-slate-800/80 flex flex-col justify-between p-4 h-screen sticky top-0 z-40">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 px-3 py-4 mb-6 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight">The Interview Agent</h1>
            <p className="text-xs text-purple-400 font-medium">Student Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner & Logout */}
      <div className="space-y-4">
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-medium text-sm transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
