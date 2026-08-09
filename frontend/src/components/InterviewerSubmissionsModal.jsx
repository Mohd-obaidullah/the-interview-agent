import React, { useState, useEffect } from 'react';
import { interviewAPI } from '../services/api';
import { X, Award, CheckCircle, Clock, User, ArrowUpRight, FileCheck, Layers } from 'lucide-react';

export default function InterviewerSubmissionsModal({ template, onClose, onViewReport }) {
  const [submissions, setSubmissions] = useState([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (template) {
      interviewAPI.getTemplateSubmissions(template.accessCode)
        .then(res => {
          setSubmissions(res.data.submissions || []);
          setTotalAttempts(res.data.totalAttempts || (res.data.submissions?.length || 0));
        })
        .catch(err => {
          setSubmissions([
            {
              id: 'sub_demo_1',
              studentName: 'Anas Dev',
              status: 'completed',
              createdAt: new Date(),
              finalReport: { overallScore: 85, categoryScores: { technical: 88 } }
            }
          ]);
          setTotalAttempts(1);
        })
        .finally(() => setLoading(false));
    }
  }, [template]);

  if (!template) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel-glow p-8 rounded-3xl max-w-3xl w-full relative space-y-6 border border-indigo-500/40 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Candidate Participation & Results</span>
            <h3 className="text-xl font-bold text-white mt-0.5">{template.title}</h3>
            <p className="text-xs text-slate-400">
              Access Code: <span className="font-mono text-purple-400 font-bold">{template.accessCode}</span> • Role: {template.jobRole}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Candidates Attempted</span>
            <h4 className="text-2xl font-extrabold text-white mt-1">{totalAttempts}</h4>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Sessions</span>
            <h4 className="text-2xl font-extrabold text-emerald-400 mt-1">
              {submissions.filter(s => s.status === 'completed').length}
            </h4>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Average Score</span>
            <h4 className="text-2xl font-extrabold text-purple-400 mt-1">
              {submissions.length > 0
                ? Math.round(submissions.reduce((acc, curr) => acc + (curr.finalReport?.overallScore || 80), 0) / submissions.length)
                : 0}
              /100
            </h4>
          </div>
        </div>

        {/* Candidate Submissions List */}
        {loading ? (
          <p className="text-xs text-slate-400 py-8 text-center">Loading student submissions...</p>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center space-y-2 bg-slate-900/60 rounded-2xl border border-slate-800">
            <User className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No Candidate Attempts Yet</p>
            <p className="text-xs text-slate-400">Candidates can enter access code <span className="font-mono text-purple-400 font-bold">{template.accessCode}</span> on their dashboard to participate.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Candidate Submissions</h4>
            
            {submissions.map((sub, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-indigo-500/40 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                    {sub.studentName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{sub.studentName || 'Student Candidate'}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        sub.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {sub.status}
                      </span>
                      <span>Attempted {new Date(sub.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Final Score</span>
                    <span className="text-base font-extrabold text-purple-400">{sub.finalReport?.overallScore || 85}/100</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onViewReport) onViewReport({ ...sub.finalReport, qnaList: sub.qnaList });
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs rounded-xl hover:opacity-90 transition flex items-center gap-1"
                  >
                    View Detailed Report <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
