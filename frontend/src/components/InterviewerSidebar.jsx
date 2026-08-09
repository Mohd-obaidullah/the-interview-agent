import React from 'react';
import { 
  Users, 
  FileCheck, 
  Settings, 
  User, 
  LogOut, 
  Briefcase 
} from 'lucide-react';

const navItems = [
  { id: 'interviewer-dashboard', label: 'Candidates Overview', icon: Users },
  { id: 'candidate-reports', label: 'Interview Submissions', icon: FileCheck },
  { id: 'interviewer-profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function InterviewerSidebar({ currentPage, setCurrentPage, onLogout }) {
  return (
    <aside className="w-64 bg-[#0b0f19]/90 border-r border-indigo-900/40 flex flex-col justify-between p-4 h-screen sticky top-0 z-40">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 px-3 py-4 mb-6 cursor-pointer" onClick={() => setCurrentPage('interviewer-dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight">The Interview Agent</h1>
            <p className="text-xs text-cyan-400 font-medium">Interviewer Portal</p>
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
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
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

      {/* Logout button */}
      <button 
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-medium text-sm transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
