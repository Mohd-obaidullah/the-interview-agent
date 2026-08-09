import React from 'react';
import { Bot, CheckCircle } from 'lucide-react';

export default function AIEvaluatorBadge({ status = 'Online', message = 'Great! Take your time to think.' }) {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 flex items-center space-x-4 bg-purple-950/20">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0b0f19] rounded-full"></span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-white">AI Interviewer</h4>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> {status}
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-0.5 font-medium">{message}</p>
      </div>
    </div>
  );
}
