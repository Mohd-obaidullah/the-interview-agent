import React, { useState } from 'react';
import { interviewAPI } from '../services/api';
import { useInterview } from '../context/InterviewContext';
import { Code, Monitor, Database, Server, Terminal, LineChart, Cpu, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

const jobRoles = [
  { id: 'Full Stack Developer', label: 'Full Stack Developer', icon: Code },
  { id: 'Frontend Developer', label: 'Frontend Developer', icon: Monitor },
  { id: 'Backend Developer', label: 'Backend Developer', icon: Server },
  { id: 'Java Developer', label: 'Java Developer', icon: Database },
  { id: 'Python Developer', label: 'Python Developer', icon: Terminal },
  { id: 'Data Analyst', label: 'Data Analyst', icon: LineChart },
  { id: 'DevOps Engineer', label: 'DevOps Engineer', icon: Cpu },
  { id: 'Other Role', label: 'Other Role', icon: Code },
];

const interviewTypes = ['Technical Interview', 'HR Interview', 'Behavioral Interview', 'Mixed Interview'];
const experienceLevels = ['Entry-Level (0-2 yrs)', 'Mid-Level (2-5 yrs)', 'Senior Level (5-8 yrs)', 'Lead / Principal'];
const difficulties = ['Easy', 'Medium', 'Hard', 'Autonomous Adaptive'];

export default function InterviewSetup({ onStartLiveInterview }) {
  const { setActiveInterview } = useInterview();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [selectedType, setSelectedType] = useState('Technical Interview');
  const [selectedExperience, setSelectedExperience] = useState('Mid-Level (2-5 yrs)');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.start({
        jobRole: selectedRole,
        experienceLevel: selectedExperience,
        interviewType: selectedType,
        difficulty: selectedDifficulty,
        totalQuestions: 10
      });
      setActiveInterview(res.data.interview);
      onStartLiveInterview(res.data.interview);
    } catch (err) {
      // Demo session fallback
      const demoSession = {
        id: `int_${Date.now()}`,
        jobRole: selectedRole,
        experienceLevel: selectedExperience,
        interviewType: selectedType,
        difficulty: selectedDifficulty,
        totalQuestionsCount: 10,
        currentQuestionIndex: 0,
        currentQuestion: {
          question: "Explain the event loop in JavaScript. How does it work with microtasks and macrotasks?",
          category: "Technical",
          difficulty: "Medium"
        },
        qnaList: []
      };
      setActiveInterview(demoSession);
      onStartLiveInterview(demoSession);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Step Indicator Header */}
      <div className="glass-panel p-6 rounded-3xl">
        <h2 className="text-2xl font-bold text-white mb-6">Interview Setup Wizard</h2>

        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0"></div>
          {[1, 2, 3, 4, 5].map((num) => {
            const labels = ['Role', 'Type', 'Experience', 'Difficulty', 'Review'];
            const active = step >= num;
            return (
              <div key={num} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  active ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40 ring-4 ring-[#0b0f19]' : 'bg-slate-800 text-slate-400'
                }`}>
                  {num}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 mt-2">{labels[num - 1]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Select Job Role */}
      {step === 1 && (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Select Job Role</h3>
            <p className="text-xs text-slate-400 mt-1">Choose the role you are preparing for</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {jobRoles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-600/20 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold">{role.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl hover:opacity-90 flex items-center gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Interview Type */}
      {step === 2 && (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Select Interview Type</h3>
            <p className="text-xs text-slate-400 mt-1">Select the domain focus of questions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interviewTypes.map((type) => (
              <div
                key={type}
                onClick={() => setSelectedType(type)}
                className={`p-6 rounded-2xl border cursor-pointer transition ${
                  selectedType === type
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <h4 className="text-sm font-bold">{type}</h4>
                <p className="text-xs text-slate-400 mt-1">Adaptive evaluation suited for {type.toLowerCase()}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="px-6 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(3)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Experience Level */}
      {step === 3 && (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Select Experience Level</h3>
            <p className="text-xs text-slate-400 mt-1">Calibrates expected depth & complexity</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {experienceLevels.map((exp) => (
              <div
                key={exp}
                onClick={() => setSelectedExperience(exp)}
                className={`p-6 rounded-2xl border cursor-pointer transition ${
                  selectedExperience === exp
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <h4 className="text-sm font-bold">{exp}</h4>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="px-6 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(4)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Difficulty */}
      {step === 4 && (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Select Difficulty</h3>
            <p className="text-xs text-slate-400 mt-1">Choose baseline question difficulty</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {difficulties.map((diff) => (
              <div
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`p-6 rounded-2xl border cursor-pointer transition ${
                  selectedDifficulty === diff
                    ? 'bg-purple-600/20 border-purple-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <h4 className="text-sm font-bold">{diff}</h4>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(3)} className="px-6 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={() => setStep(5)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Review & Start */}
      {step === 5 && (
        <div className="glass-panel p-8 rounded-3xl space-y-6">
          <div className="text-center">
            <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">Review Interview Configurations</h3>
            <p className="text-xs text-slate-400">Ready to initiate your autonomous AI interview</p>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs"><span className="text-slate-400">Job Role:</span> <span className="font-bold text-white">{selectedRole}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Interview Type:</span> <span className="font-bold text-white">{selectedType}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Experience Level:</span> <span className="font-bold text-white">{selectedExperience}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Base Difficulty:</span> <span className="font-bold text-white">{selectedDifficulty}</span></div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(4)} className="px-6 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleLaunch}
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-purple-600/40 flex items-center gap-2"
            >
              {loading ? 'AI Generating Session...' : 'Start AI Interview'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
