import React, { useState, useEffect } from 'react';
import { interviewAPI } from '../services/api';
import StudentJoinModal from '../components/StudentJoinModal';
import StatCard from '../components/StatCard';
import SkillRadarChart from '../components/SkillRadarChart';
import ScoreTrendChart from '../components/ScoreTrendChart';
import { Video, Award, TrendingUp, Sparkles, Code, Play, ArrowUpRight, KeyRound, Clock, HelpCircle, Briefcase, FileCheck, CheckCircle } from 'lucide-react';

export default function Dashboard({ onStartInterview, onViewReport, onStartInterviewWithConfig }) {
  const [publishedInterviews, setPublishedInterviews] = useState([]);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [modalInitialCode, setModalInitialCode] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);

  const recentInterviews = [
    { id: '1', role: 'Full Stack Developer', type: 'Technical Interview', score: 85, date: '2 days ago', badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    { id: '2', role: 'Frontend Developer', type: 'Technical Interview', score: 68, date: '5 days ago', badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    { id: '3', role: 'HR Interview', type: 'HR Interview', score: 74, date: '1 week ago', badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
    { id: '4', role: 'Backend Developer', type: 'Technical Interview', score: 91, date: '2 weeks ago', badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  ];

  useEffect(() => {
    interviewAPI.getTemplateByCode('INT-STUDENT1')
      .then(res => {
        if (res.data.template) {
          setPublishedInterviews([res.data.template]);
        }
      })
      .catch(err => {
        setPublishedInterviews([
          {
            accessCode: 'INT-STUDENT1',
            title: 'Full Stack Engineer Technical Screen',
            jobRole: 'Full Stack Developer',
            difficulty: 'Medium',
            totalQuestionsCount: 5,
            timeLimitMinutes: 30,
            interviewerName: 'Sarah Recruiter'
          }
        ]);
      });
  }, []);

  const handleOpenJoinCode = (e) => {
    e.preventDefault();
    if (accessCodeInput) {
      setModalInitialCode(accessCodeInput.trim().toUpperCase());
      setJoinModalOpen(true);
    }
  };

  const handleStartFromCard = (tpl) => {
    setModalInitialCode(tpl.accessCode);
    setJoinModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Access Code Entry Banner */}
      <div className="glass-panel-glow p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 border border-purple-500/30">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Join Interview by Access Code</h3>
            <p className="text-xs text-slate-400">Have an Access Code from an interviewer? Enter it below to start your adaptive screen.</p>
          </div>
        </div>

        <form onSubmit={handleOpenJoinCode} className="flex items-center space-x-2 w-full md:w-auto">
          <input
            type="text"
            value={accessCodeInput}
            onChange={(e) => setAccessCodeInput(e.target.value)}
            placeholder="e.g. INT-STUDENT1"
            className="px-4 py-2.5 rounded-xl glass-input text-xs font-mono font-bold uppercase tracking-wider w-full md:w-48"
          />
          <button
            type="submit"
            disabled={!accessCodeInput}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Enter Code
          </button>
        </form>
      </div>

      {/* Available Published Interviews Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Available Published Interviews</h3>
            <p className="text-xs text-slate-400">Published technical screens created by hiring managers</p>
          </div>
          <span className="text-xs text-purple-400 font-semibold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            {publishedInterviews.length} Available
          </span>
        </div>

        {publishedInterviews.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <Video className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No Published Interviews Available</p>
            <p className="text-xs text-slate-400">Enter a valid recruiter access code above to join a custom interview session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedInterviews.map((tpl) => (
              <div key={tpl.accessCode} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-purple-500/40 transition">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Created by {tpl.interviewerName || 'Recruiter'}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{tpl.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{tpl.jobRole}</span> • <span>{tpl.difficulty}</span> • <span>{tpl.totalQuestionsCount} Questions</span>
                  </p>
                </div>

                <button
                  onClick={() => handleStartFromCard(tpl)}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-purple-600/30 shrink-0"
                >
                  <Play className="w-3.5 h-3.5" /> Start Interview
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Interviews" value="12" badgeText="+2 this week" icon={Video} />
        <StatCard title="Interviews Completed" value="12" badgeText="100% Rate" icon={FileCheck} />
        <StatCard title="Average Score" value="76" badgeText="+8.4%" icon={TrendingUp} trend="+5.2 points" />
        <StatCard title="Best Score" value="92/100" badgeText="Technical Screen" badgeColor="bg-purple-500/10 text-purple-400 border border-purple-500/20" icon={Award} />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Interviews & Score Trend */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Interviews Card */}
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Recent Interviews</h3>
                <p className="text-xs text-slate-400">Review your past session evaluations</p>
              </div>
              <button onClick={onViewReport} className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                View All Results <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentInterviews.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-purple-500/40 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.role}</h4>
                      <p className="text-xs text-slate-400">{item.type} • {item.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl ${item.badgeColor}`}>
                      {item.score}/100
                    </span>
                    <button
                      onClick={onViewReport}
                      className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-700 transition"
                    >
                      View Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Trend Chart */}
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Score Trend</h3>
                <p className="text-xs text-slate-400">Progression over the last 30 days</p>
              </div>
              <span className="text-xs text-slate-400 bg-slate-800/60 px-3 py-1 rounded-xl border border-slate-700">Last 30 days</span>
            </div>
            <ScoreTrendChart />
          </div>
        </div>

        {/* Right Column: Skills Radar & Practice Recommendations */}
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Skills Performance</h3>
              <button className="text-xs text-purple-400 font-medium hover:underline">View full report</button>
            </div>
            <SkillRadarChart />
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white">Recommended Practice</h3>
            
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">System Design Basics</h4>
                <p className="text-[11px] text-slate-400">Improve system architecture depth</p>
              </div>
              <button onClick={onStartInterview} className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition">
                Start
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Advanced JavaScript</h4>
                <p className="text-[11px] text-slate-400">Deepen your async concepts</p>
              </div>
              <button onClick={onStartInterview} className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition">
                Start
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Join Code Modal */}
      <StudentJoinModal
        isOpen={joinModalOpen}
        initialCode={modalInitialCode}
        onClose={() => setJoinModalOpen(false)}
        onStartInterview={(config) => {
          if (onStartInterviewWithConfig) {
            onStartInterviewWithConfig(config);
          } else {
            onStartInterview();
          }
        }}
      />
    </div>
  );
}
