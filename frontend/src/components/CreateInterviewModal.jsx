import React, { useState } from 'react';
import { interviewAPI } from '../services/api';
import { Sparkles, X, Code, Clock, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export default function CreateInterviewModal({ isOpen, onClose, onPreviewGenerated }) {
  const [title, setTitle] = useState('');
  const [jobRole, setJobRole] = useState('Full Stack Developer');
  const [skills, setSkills] = useState('JavaScript, React, Node.js, System Design');
  const [difficulty, setDifficulty] = useState('Medium');
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(5);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await interviewAPI.createTemplate({
        title,
        jobRole,
        skills: skills.split(',').map(s => s.trim()),
        difficulty,
        totalQuestionsCount: parseInt(totalQuestionsCount),
        timeLimitMinutes: parseInt(timeLimitMinutes)
      });
      onPreviewGenerated(res.data.template);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate interview preview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel-glow p-8 rounded-3xl max-w-xl w-full relative space-y-6 border border-indigo-500/40 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Create New Interview</h3>
              <p className="text-xs text-slate-400">Generate an AI adaptive interview for candidates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Interview Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer Technical Screen"
              className="w-full p-3 rounded-xl glass-input text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Job Role</label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-xs bg-[#0b0f19]"
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-xs bg-[#0b0f19]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Adaptive">Adaptive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Skills & Topics (Comma Separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="JavaScript, React, Node.js, System Design"
              className="w-full p-3 rounded-xl glass-input text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Number of Questions</label>
              <input
                type="number"
                min="3"
                max="20"
                value={totalQuestionsCount}
                onChange={(e) => setTotalQuestionsCount(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Time Limit (Minutes)</label>
              <input
                type="number"
                min="10"
                max="120"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-xs"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs rounded-xl hover:opacity-90 transition flex items-center gap-2"
            >
              {loading ? 'AI Generating Questions...' : 'Generate AI Preview'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
