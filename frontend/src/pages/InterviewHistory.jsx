import React, { useState, useEffect } from 'react';
import { interviewAPI } from '../services/api';
import { Video, Award, Calendar, ArrowRight, CheckCircle, Clock } from 'lucide-react';

export default function InterviewHistory({ onViewReport }) {
  const [history, setHistory] = useState([
    {
      id: 'int_demo_01',
      jobRole: 'Full Stack Developer',
      interviewType: 'Technical Interview',
      difficulty: 'Medium',
      status: 'completed',
      date: '2026-08-06',
      finalReport: { overallScore: 85 }
    },
    {
      id: 'int_demo_02',
      jobRole: 'Frontend Developer',
      interviewType: 'Technical Interview',
      difficulty: 'Hard',
      status: 'completed',
      date: '2026-08-01',
      finalReport: { overallScore: 78 }
    }
  ]);

  useEffect(() => {
    interviewAPI.getHistory()
      .then(res => {
        if (res.data.history && res.data.history.length > 0) {
          setHistory(res.data.history);
        }
      })
      .catch(err => console.log('Using default history list'));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Interview History & Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">Review and compare past autonomous interview sessions</p>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onViewReport(item.finalReport)}
            className="glass-panel p-6 rounded-3xl flex items-center justify-between hover:border-purple-500/40 cursor-pointer transition"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{item.jobRole}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{item.interviewType}</span> • <span>{item.difficulty}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Overall Score</span>
                <span className="text-xl font-extrabold text-purple-400">{item.finalReport?.overallScore || 80}/100</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
