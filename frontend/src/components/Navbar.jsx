import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export default function Navbar({ user }) {
  return (
    <header className="h-20 border-b border-slate-800/80 bg-[#0b0f19]/60 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Welcome back, <span className="text-purple-400">{user?.name || 'Candidate'}</span> 👋
        </h2>
        <p className="text-xs text-slate-400">Ready for your next AI interview?</p>
      </div>

      <div className="flex items-center space-x-5">
        {/* Search Input */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search interviews, topics..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-slate-200 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full ring-4 ring-[#0b0f19]"></span>
        </button>

        {/* User Profile Capsule */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <User className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h4 className="text-xs font-bold text-white leading-tight">{user?.name || 'Anas'}</h4>
            <p className="text-[11px] text-purple-400 font-medium">{user?.role || 'Full Stack Developer'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
