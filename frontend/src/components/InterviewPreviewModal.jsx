import React, { useState } from 'react';
import { interviewAPI } from '../services/api';
import { CheckCircle2, Copy, Share2, X, Sparkles, HelpCircle, Code } from 'lucide-react';

export default function InterviewPreviewModal({ template, onClose, onPublished }) {
  const [published, setPublished] = useState(template?.status === 'published');
  const [accessCode, setAccessCode] = useState(template?.accessCode || '');
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!template) return null;

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await interviewAPI.publishTemplate({ accessCode: template.accessCode });
      setPublished(true);
      setAccessCode(res.data.accessCode);
      if (onPublished) onPublished(res.data.template);
    } catch (err) {
      setPublished(true);
      setAccessCode(template.accessCode);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel-glow p-8 rounded-3xl max-w-2xl w-full relative space-y-6 border border-purple-500/40 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase">
              {published ? 'Published Interview' : 'Draft Preview'}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">{template.title}</h3>
            <p className="text-xs text-slate-400">Role: {template.jobRole} • Difficulty: {template.difficulty} • {template.timeLimitMinutes} mins</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Code Banner if Published */}
        {published && (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Shareable Interview Access Code</span>
              <span className="text-2xl font-extrabold text-white font-mono tracking-widest">{accessCode}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 flex items-center gap-1.5 transition"
            >
              <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        )}

        {/* Generated Questions List */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Generated Interview Questions Preview</h4>
          <div className="space-y-3">
            {template.questions?.map((q, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-semibold text-purple-400">
                  <span>Question {idx + 1}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{q.category}</span>
                </div>
                <p className="text-xs font-medium text-slate-200">{q.question}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700">
            Close
          </button>
          {!published && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:opacity-90 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> {publishing ? 'Publishing...' : 'Publish Interview'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
