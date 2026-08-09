import React, { useState, useEffect, useRef } from 'react';
import { interviewAPI } from '../services/api';
import { useInterview } from '../context/InterviewContext';
import AIEvaluatorBadge from '../components/AIEvaluatorBadge';
import VoiceWaveform from '../components/VoiceWaveform';
import { 
  Clock, 
  Mic, 
  Square, 
  Pause, 
  SkipForward, 
  CheckCircle2, 
  Lightbulb, 
  Send, 
  Sparkles
} from 'lucide-react';

export default function LiveInterview({ session, onFinish }) {
  const { setLastReport } = useInterview();
  const [currentQuestion, setCurrentQuestion] = useState(
    session?.currentQuestion || {
      question: "Explain the event loop in JavaScript. How does it work with microtasks and macrotasks?",
      category: "Technical",
      difficulty: "Medium"
    }
  );

  const [questionIndex, setQuestionIndex] = useState(session?.currentQuestionIndex || 0);
  const totalQuestions = session?.totalQuestionsCount || 5;
  
  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Input states
  const [answerMode, setAnswerMode] = useState('voice'); // 'voice' | 'text'
  const [textAnswer, setTextAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [listeningSeconds, setListeningSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');

  // Live 6-Criteria Evidence Evaluation State
  const [liveEvaluation, setLiveEvaluation] = useState({
    technicalAccuracy: 75,
    relevance: 80,
    completeness: 70,
    problemSolving: 75,
    communication: 80,
    professionalQuality: 75,
    overallQuestionScore: 76
  });

  const [submitting, setSubmitting] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  const recognitionRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let timer;
    if (!isPaused) {
      timer = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  // Voice recording timer effect
  useEffect(() => {
    let micTimer;
    if (isListening) {
      micTimer = setInterval(() => setListeningSeconds(prev => prev + 1), 1000);
    } else {
      setListeningSeconds(0);
    }
    return () => clearInterval(micTimer);
  }, [isListening]);

  // Speech Recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (err) => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          setIsListening(true);
        }
      } else {
        setIsListening(true);
      }
    }
  };

  const handleNextQuestion = async () => {
    const finalCandidateAnswer = answerMode === 'voice' ? transcript : textAnswer;
    setSubmitting(true);

    try {
      const res = await interviewAPI.submitAnswer({
        interviewId: session.id,
        candidateAnswer: finalCandidateAnswer || 'Candidate gave a concise answer.',
        answerType: answerMode
      });

      if (res.data.lastEvaluation) {
        setLiveEvaluation(res.data.lastEvaluation);
      }

      if (res.data.completed) {
        setLastReport(res.data.finalReport);
        onFinish(res.data.finalReport);
        return;
      }

      setQuestionIndex(res.data.currentQuestionIndex);
      setCurrentQuestion(res.data.nextQuestion);
      setTranscript('');
      setTextAnswer('');
      setHintVisible(false);
    } catch (err) {
      setQuestionIndex(prev => prev + 1);
      setTranscript('');
      setTextAnswer('');
      setHintVisible(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (totalSecs) => {
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const progressPercent = Math.round(((questionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="glass-panel px-6 py-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 bg-purple-500 rounded-full animate-ping"></span>
          <h2 className="text-lg font-bold text-white">Evidence-Based AI Interview</h2>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-slate-300 font-mono text-sm bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <button
            onClick={() => onFinish()}
            className="px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold rounded-xl transition"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Question Card & Answer Box */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {questionIndex + 1} of {totalQuestions}
              </span>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                  {currentQuestion.category || 'Technical'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                  {currentQuestion.difficulty || 'Medium'}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <h3 className="text-xl font-bold text-white leading-relaxed pt-2">
              {currentQuestion.question}
            </h3>

            <div>
              <button
                onClick={() => setHintVisible(!hintVisible)}
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4" /> {hintVisible ? 'Hide Hint' : 'Question Hint'}
              </button>
              {hintVisible && (
                <div className="mt-3 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
                  Be precise and mention foundational mechanisms, execution context, and core trade-offs.
                </div>
              )}
            </div>
          </div>

          {/* Candidate Answer Box */}
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Your Answer</h4>
              <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setAnswerMode('voice')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    answerMode === 'voice' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Voice Answer
                </button>
                <button
                  onClick={() => setAnswerMode('text')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    answerMode === 'text' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Text Answer
                </button>
              </div>
            </div>

            {/* Voice View */}
            {answerMode === 'voice' ? (
              <div className="text-center py-6 space-y-4">
                <button
                  onClick={toggleListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-300 shadow-xl ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/20 shadow-rose-600/50'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-600/40 hover:scale-105'
                  }`}
                >
                  {isListening ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">
                    {isListening ? `Listening... ${String(Math.floor(listeningSeconds / 60)).padStart(2, '0')}:${String(listeningSeconds % 60).padStart(2, '0')}` : 'Click microphone to record answer'}
                  </p>
                  <VoiceWaveform isListening={isListening} />
                </div>

                {transcript && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs text-slate-200 max-h-32 overflow-y-auto">
                    <span className="font-bold text-purple-400 block mb-1">Live Voice Transcript:</span>
                    {transcript}
                  </div>
                )}
              </div>
            ) : (
              /* Text View */
              <div className="space-y-3">
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your structured answer here..."
                  rows={6}
                  className="w-full p-4 rounded-2xl glass-input text-sm focus:outline-none"
                ></textarea>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Pause className="w-4 h-4" /> {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <SkipForward className="w-4 h-4" /> Skip
                </button>
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl hover:opacity-90 transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
              >
                {submitting ? 'AI Evaluating...' : 'Submit & Next Question'} <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Evidence-Based 6 Criteria Live Gauges */}
        <div className="space-y-6">
          <AIEvaluatorBadge status="Online" message="Evaluates technical correctness, completeness & logic." />

          {/* 6 Criteria Weighted Breakdown Card */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Evidence Scoring (Weighted)</h4>
              <span className="text-xs font-bold text-purple-400 font-mono">{liveEvaluation.overallQuestionScore || 76}/100</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Technical Correctness (35%)</span>
                  <span className="text-purple-400">{liveEvaluation.technicalAccuracy}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${liveEvaluation.technicalAccuracy}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Relevance (20%)</span>
                  <span className="text-indigo-400">{liveEvaluation.relevance}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${liveEvaluation.relevance}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Completeness (15%)</span>
                  <span className="text-cyan-400">{liveEvaluation.completeness}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full" style={{ width: `${liveEvaluation.completeness}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Problem Solving (15%)</span>
                  <span className="text-emerald-400">{liveEvaluation.problemSolving}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${liveEvaluation.problemSolving}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Communication (10%)</span>
                  <span className="text-amber-400">{liveEvaluation.communication}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${liveEvaluation.communication}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Professional Quality (5%)</span>
                  <span className="text-pink-400">{liveEvaluation.professionalQuality}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full" style={{ width: `${liveEvaluation.professionalQuality}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
