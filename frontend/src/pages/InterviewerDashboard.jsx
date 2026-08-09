import React, { useState, useEffect } from 'react';
import { interviewAPI } from '../services/api';
import CreateInterviewModal from '../components/CreateInterviewModal';
import InterviewPreviewModal from '../components/InterviewPreviewModal';
import InterviewerSubmissionsModal from '../components/InterviewerSubmissionsModal';
import StatCard from '../components/StatCard';
import { Users, Trophy, FileText, CheckCircle, ArrowUpRight, Plus, Copy, Share2, Sparkles, Filter, Code, FileCheck, Layers } from 'lucide-react';

export default function InterviewerDashboard({ onViewCandidateReport }) {
  const [templates, setTemplates] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [selectedSubmissionTpl, setSelectedSubmissionTpl] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTemplates = () => {
    setLoading(true);
    interviewAPI.getInterviewerTemplates()
      .then(res => setTemplates(res.data.templates || []))
      .catch(err => {
        setTemplates([
          {
            id: 'tpl_default_1',
            title: 'Full Stack Engineer Technical Screen',
            jobRole: 'Full Stack Developer',
            difficulty: 'Medium',
            timeLimitMinutes: 30,
            status: 'published',
            accessCode: 'INT-STUDENT1',
            attemptsCount: 1,
            completedCount: 1,
            createdAt: new Date()
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const totalCreated = templates.length;
  const totalCandidates = templates.reduce((acc, curr) => acc + (curr.attemptsCount || 0), 0) || 48;
  const totalCompleted = templates.reduce((acc, curr) => acc + (curr.completedCount || 0), 0) || 45;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Recruiter Management Portal
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Interviewer Control Center</h2>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" /> Create New Interview
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Interviews Created" value={totalCreated} badgeText="Active Templates" icon={Code} />
        <StatCard title="Total Candidates" value={totalCandidates} badgeText="+6 today" icon={Users} />
        <StatCard title="Completed Interviews" value={totalCompleted} badgeText="Evaluated" badgeColor="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" icon={FileCheck} />
        <StatCard title="Avg Candidate Score" value="81/100" badgeText="+3.2 pts" icon={FileText} />
      </div>

      {/* Created Interviews Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Your Created & Published Interviews</h3>
            <p className="text-xs text-slate-400">Share unique access codes with candidates to conduct screens</p>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 py-8 text-center">Loading interview templates...</p>
        ) : templates.length === 0 ? (
          <div className="p-8 text-center space-y-3 bg-slate-900/60 rounded-2xl border border-slate-800">
            <Code className="w-8 h-8 text-indigo-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-200">No Interviews Created Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Click "Create New Interview" to generate an AI adaptive technical screen for your candidate pool.</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Interview Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div key={tpl.accessCode} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-indigo-500/40 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      tpl.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {tpl.status}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{tpl.title}</h4>
                    <p className="text-xs text-slate-400">{tpl.jobRole} • {tpl.difficulty} • {tpl.timeLimitMinutes} Mins</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Access Code</span>
                    <span className="text-sm font-extrabold text-purple-400 font-mono tracking-wider">{tpl.accessCode}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleCopyCode(tpl.accessCode)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copiedCode === tpl.accessCode ? 'Code Copied!' : 'Copy Code'}
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedPreview(tpl)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700 transition"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setSelectedSubmissionTpl(tpl)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs rounded-xl hover:opacity-90 transition flex items-center gap-1 shadow-lg shadow-indigo-600/20"
                    >
                      View Results <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateInterviewModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPreviewGenerated={(newTpl) => {
          setSelectedPreview(newTpl);
          fetchTemplates();
        }}
      />

      <InterviewPreviewModal
        template={selectedPreview}
        onClose={() => setSelectedPreview(null)}
        onPublished={(pubTpl) => {
          fetchTemplates();
        }}
      />

      <InterviewerSubmissionsModal
        template={selectedSubmissionTpl}
        onClose={() => setSelectedSubmissionTpl(null)}
        onViewReport={onViewCandidateReport}
      />
    </div>
  );
}
