import React from 'react';
import { Sparkles, Shield, Cpu, Award, ArrowRight, GraduationCap, Briefcase, Play } from 'lucide-react';

export default function Landing({ onLaunchPlatform, onStartFreeInterview, onSelectStudent, onSelectInterviewer }) {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Radial Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Header Navigation */}
      <nav className="px-6 md:px-8 py-6 flex items-center justify-between border-b border-slate-800/60 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onLaunchPlatform}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-lg md:text-xl tracking-tight">The Interview Agent</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onSelectStudent}
            className="hidden sm:flex px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-800 transition items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-purple-400" /> Student Portal
          </button>
          <button
            onClick={onLaunchPlatform}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs hover:opacity-90 transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Launch Platform
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-center relative z-10 space-y-8">
        <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2">
          <Cpu className="w-4 h-4" /> Next-Gen Autonomous AI Interviewer
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
          Master Your Next Tech Interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">Autonomous AI</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The autonomous AI platform that conducts adaptive technical screens, evaluates answers on 6 criteria in real time, and helps recruiters & candidates succeed.
        </p>

        {/* Distinct CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartFreeInterview}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm md:text-base hover:shadow-xl hover:shadow-purple-600/40 transition flex items-center justify-center gap-3"
          >
            <GraduationCap className="w-5 h-5" /> Start Free AI Interview <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onLaunchPlatform}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white font-bold text-sm md:text-base hover:bg-slate-800 transition flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 text-indigo-400" /> Launch Platform <ArrowRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <Shield className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Resume Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Parses technical stack, experience, and projects to generate custom interview screens.</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <Cpu className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-base font-bold text-white mb-2">6 Criteria Weighted Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Evaluates Technical Correctness (35%), Relevance (20%), Completeness (15%), Problem Solving (15%), Communication (10%), and Professional Quality (5%).</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            <Award className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-base font-bold text-white mb-2">Role Protection & Portals</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Dedicated workspace dashboards for Students and Interviewer Teams with complete report analytics.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-500 border-t border-slate-900">
        © 2026 The Interview Agent. Autonomous AI Platform built for candidate & recruiter success.
      </footer>
    </div>
  );
}
