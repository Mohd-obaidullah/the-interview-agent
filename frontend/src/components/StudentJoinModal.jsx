import React, { useState } from 'react';
import { interviewAPI } from '../services/api';
import { Play, X, Clock, HelpCircle, Briefcase, Award, AlertCircle } from 'lucide-react';

export default function StudentJoinModal({ isOpen, initialCode = '', onClose, onStartInterview }) {
  const [accessCode, setAccessCode] = useState(initialCode);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!accessCode) return;
    setError('');
    setLoading(true);

    try {
      const res = await interviewAPI.getTemplateByCode(accessCode.trim());
      setTemplate(res.data.template);
    } catch (err) {
      setError(err.response?.data?.error || 'No published interview found for this access code.');
      setTemplate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (template) {
      onStartInterview({
        accessCode: template.accessCode,
        jobRole: template.jobRole,
        difficulty: template.difficulty,
        totalQuestionsCount: template.totalQuestionsCount,
        title: template.title
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel-glow p-8 rounded-3xl max-w-md w-full relative space-y-6 border border-purple-500/40">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-white">Join Interview by Access Code</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Code Input Form */}
        <form onSubmit={handleLookup} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Enter Interview ID / Code</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="e.g. INT-STUDENT1"
              className="flex-1 p-3 rounded-xl glass-input text-xs font-mono font-bold uppercase tracking-wider"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
            >
              {loading ? 'Finding...' : 'Lookup'}
            </button>
          </div>
        </form>

        {/* Interview Details Card */}
        {template && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Created by {template.interviewerName}</span>
              <h4 className="text-base font-bold text-white mt-0.5">{template.title}</h4>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-purple-400" /> <span>{template.jobRole}</span></div>
              <div className="flex items-center gap-1.5"><Award className="w-4 h-4 text-indigo-400" /> <span>{template.difficulty}</span></div>
              <div className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-cyan-400" /> <span>{template.totalQuestionsCount} Questions</span></div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> <span>{template.timeLimitMinutes} Mins</span></div>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              <Play className="w-4 h-4" /> Start Interview Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
