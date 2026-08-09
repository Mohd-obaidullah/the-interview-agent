import React from 'react';
import { UserCheck, Briefcase, GraduationCap, ArrowRight, Zap, Shield } from 'lucide-react';

export default function RoleSelection({ onSelectStudent, onSelectInterviewer, onBackToLanding }) {
  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-xl w-full relative z-10 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div 
            onClick={onBackToLanding}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30 cursor-pointer hover:scale-105 transition"
          >
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">The Interview Agent</h1>
          <p className="text-sm font-semibold text-purple-400">Continue as</p>
        </div>

        {/* Role Selection Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Card */}
          <div
            onClick={onSelectStudent}
            className="glass-panel-glow p-8 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all duration-300 border border-purple-500/30 flex flex-col justify-between group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-600 group-hover:text-white transition duration-300">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Student</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Practice adaptive mock interviews, receive live AI evaluations, and improve your technical performance.
              </p>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 group-hover:opacity-90 flex items-center justify-center gap-2">
              Continue as Student <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interviewer Card */}
          <div
            onClick={onSelectInterviewer}
            className="glass-panel-glow p-8 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all duration-300 border border-indigo-500/30 flex flex-col justify-between group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Interviewer</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Review candidate interview submissions, inspect detailed AI reports, and manage interview rubrics.
              </p>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 group-hover:opacity-90 flex items-center justify-center gap-2">
              Continue as Interviewer <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-center">
          <button onClick={onBackToLanding} className="text-xs text-slate-400 hover:text-slate-200">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
