import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Download, CheckCircle, AlertTriangle, ArrowRight, Award, Sparkles, BookOpen, MessageSquare, Check, X, ShieldAlert, FileText } from 'lucide-react';

export default function InterviewReport({ reportData, onPracticeAgain }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'qna'

  React.useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const report = reportData || {
    overallScore: 82,
    categoryScores: {
      technical: 78,
      relevance: 82,
      completeness: 72,
      problemSolving: 80,
      communication: 85
    },
    totalQuestions: 5,
    totalCorrect: 3,
    totalPartiallyCorrect: 1,
    totalIncorrect: 1,
    totalMistakesCount: 2,
    totalMissingConceptsCount: 3,
    allMistakes: [
      "Claimed JavaScript event loop runs microtasks asynchronously on a separate OS thread.",
      "Omitted temporal dead zone initialization rules."
    ],
    allMissingConcepts: [
      "Microtask vs Macrotask queue priorities",
      "Temporal Dead Zone & hoisting behavior",
      "Execution context stack frames"
    ],
    strengths: [
      "Clear explanation of component rendering lifecycles",
      "Good structure and professional vocabulary",
      "Articulate explanation of basic API integration"
    ],
    weaknesses: [
      "Technical accuracy degrades when explaining low-level async mechanics",
      "Incomplete responses on edge case scenarios"
    ],
    detailedFeedback: "Evaluation complete based on 6 weighted criteria (Technical Correctness 35%, Relevance 20%, Completeness 15%, Problem Solving 15%, Communication 10%, Professional Quality 5%). Score calculated programmatically.",
    recommendedTopics: ["JavaScript Event Loop Queues", "Hoisting & TDZ", "Execution Context", "Async Code Patterns"],
    personalizedPlan: [
      "Review microtask and macrotask queue priority rules",
      "Practice STAR framework to ensure completeness in responses",
      "Conduct timed technical drills on async JS execution"
    ],
    readinessScore: 84
  };

  const qnaList = reportData?.qnaList || [
    {
      questionId: 1,
      question: "Explain the event loop in JavaScript. How does it work with microtasks and macrotasks?",
      category: "Technical",
      difficulty: "Medium",
      candidateAnswer: "The event loop runs microtasks from promises after macrotasks like setTimeout finishes.",
      answerType: "text",
      evaluation: {
        overallQuestionScore: 68,
        technicalAccuracy: 65,
        relevance: 80,
        completeness: 60,
        problemSolving: 70,
        communication: 80,
        professionalQuality: 75,
        mistakes: ["Stated macrotasks execute before microtasks."],
        incorrectStatements: ["Claimed setTimeout queue takes priority over Promise.then queue."],
        missingConcepts: ["Microtasks execute to completion before next macrotask is dequeued."],
        strengths: ["Directly addressed the question."],
        weaknesses: ["Factual mistake on queue execution priority order."],
        suggestedAnswer: "The event loop continuously monitors the call stack. When empty, it processes ALL pending microtasks (Promises) first before executing the next macrotask (setTimeout).",
        feedback: "Partially correct answer with a factual mistake on queue priority."
      }
    }
  ];

  const handleDownload = () => {
    const text = JSON.stringify(report, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Interview_Report_The_Interview_Agent.json';
    a.click();
  };

  // Helper score color indicator
  const getScoreBand = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 75) return { label: 'Good', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
    if (score >= 60) return { label: 'Average', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    if (score >= 40) return { label: 'Weak', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    return { label: 'Poor', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const overallBand = getScoreBand(report.overallScore);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 border border-purple-500/20">
            <Award className="w-3.5 h-3.5" /> Evidence-Based AI Report
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Interview Performance Analysis</h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-900/80 p-1 rounded-xl border border-slate-800 flex space-x-1">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'summary' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Executive Summary
            </button>
            <button
              onClick={() => setActiveTab('qna')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'qna' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Itemized Question Review ({qnaList.length})
            </button>
          </div>

          <button onClick={handleDownload} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl hover:opacity-90 flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>

      {/* Tab 1: Executive Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-8">
          {/* Top Score & Performance Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Score Dial */}
            <div className="glass-panel p-6 rounded-3xl text-center space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weighted Final Score</h4>
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-1 mx-auto flex items-center justify-center shadow-lg shadow-purple-600/30">
                <div className="w-full h-full bg-[#0b0f19] rounded-full flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">{report.overallScore}</span>
                  <span className="text-[10px] text-slate-400">/100</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${overallBand.color}`}>
                {overallBand.label} Performance
              </span>
            </div>

            {/* Questions Performance Breakdown */}
            <div className="glass-panel p-6 rounded-3xl text-center space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Questions Result</h4>
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Correct (80-100)</span>
                  <span className="font-bold text-white">{report.totalCorrect || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-400 font-bold flex items-center gap-1"><Sparkles className="w-4 h-4" /> Partial (60-79)</span>
                  <span className="font-bold text-white">{report.totalPartiallyCorrect || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-rose-400 font-bold flex items-center gap-1"><X className="w-4 h-4" /> Weak (&lt;60)</span>
                  <span className="font-bold text-white">{report.totalIncorrect || 0}</span>
                </div>
              </div>
            </div>

            {/* Total Mistakes Count */}
            <div className="glass-panel p-6 rounded-3xl text-center space-y-2 border border-rose-500/20">
              <ShieldAlert className="w-7 h-7 text-rose-400 mx-auto" />
              <span className="text-xs font-bold text-slate-400 uppercase block">Total Technical Mistakes</span>
              <span className="text-3xl font-extrabold text-rose-400">{report.totalMistakesCount || 0}</span>
              <p className="text-[11px] text-slate-400">Penalties applied programmatically</p>
            </div>

            {/* Total Missing Concepts */}
            <div className="glass-panel p-6 rounded-3xl text-center space-y-2 border border-amber-500/20">
              <AlertTriangle className="w-7 h-7 text-amber-400 mx-auto" />
              <span className="text-xs font-bold text-slate-400 uppercase block">Missing Key Concepts</span>
              <span className="text-3xl font-extrabold text-amber-400">{report.totalMissingConceptsCount || 0}</span>
              <p className="text-[11px] text-slate-400">Target topics for study</p>
            </div>
          </div>

          {/* 6 Criteria Weighted Score Bars */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">6 Evidence Criteria Breakdown</h4>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Technical Correctness (35%)', score: report.categoryScores?.technical || 78 },
                { label: 'Relevance (20%)', score: report.categoryScores?.relevance || 82 },
                { label: 'Completeness (15%)', score: report.categoryScores?.completeness || 72 },
                { label: 'Problem Solving (15%)', score: report.categoryScores?.problemSolving || 80 },
                { label: 'Communication (10%)', score: report.categoryScores?.communication || 85 },
                { label: 'Professional Quality (5%)', score: report.categoryScores?.professional || 80 },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-purple-400">{item.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full" style={{ width: `${item.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mistakes & Missing Concepts Lists */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Technical Mistakes List */}
            <div className="glass-panel p-6 rounded-3xl space-y-3 border border-rose-500/20">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <X className="w-4 h-4" /> Detected Technical Mistakes
              </h4>
              {report.allMistakes && report.allMistakes.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-300">
                  {report.allMistakes.map((mst, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 shrink-0"></span>
                      <span>{mst}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">No major technical mistakes detected.</p>
              )}
            </div>

            {/* Missing Concepts List */}
            <div className="glass-panel p-6 rounded-3xl space-y-3 border border-amber-500/20">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Missing Expected Concepts
              </h4>
              {report.allMissingConcepts && report.allMissingConcepts.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-300">
                  {report.allMissingConcepts.map((msc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0"></span>
                      <span>{msc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">All expected technical concepts were covered.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Itemized Question Review */}
      {activeTab === 'qna' && (
        <div className="space-y-6">
          {qnaList.map((item, idx) => {
            const ev = item.evaluation || {};
            const qScore = ev.overallQuestionScore || 70;
            const qBand = getScoreBand(qScore);

            return (
              <div key={idx} className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                        Question {idx + 1} ({item.category || 'Technical'})
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {item.difficulty || 'Medium'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">{item.question}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Weighted Score</span>
                    <span className={`text-xl font-extrabold ${qBand.color.split(' ')[0]}`}>{qScore}/100</span>
                  </div>
                </div>

                {/* Candidate Answer */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Candidate Answer ({item.answerType || 'text'}):</span>
                  <p className="text-xs text-slate-200 leading-relaxed italic">"{item.candidateAnswer || 'No response recorded.'}"</p>
                </div>

                {/* mistakes & missing concepts in this question */}
                {ev.mistakes && ev.mistakes.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 space-y-1">
                    <span className="font-bold block flex items-center gap-1"><X className="w-3.5 h-3.5 text-rose-400" /> Mistakes Identified:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {ev.mistakes.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                )}

                {ev.missingConcepts && ev.missingConcepts.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                    <span className="font-bold block flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Missing Concepts:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {ev.missingConcepts.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                )}

                {/* Suggested Correct Answer */}
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs space-y-1">
                  <span className="font-bold text-indigo-300 block flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Suggested Correct / Model Answer:
                  </span>
                  <p className="text-slate-200 leading-relaxed">{ev.suggestedAnswer || "Refer to core documentation."}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
