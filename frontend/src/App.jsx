import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InterviewProvider, useInterview } from './context/InterviewContext';
import { interviewAPI } from './services/api';
import Sidebar from './components/Sidebar';
import InterviewerSidebar from './components/InterviewerSidebar';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import RoleSelection from './pages/RoleSelection';
import StudentSignUp from './pages/StudentSignUp';
import StudentLogin from './pages/StudentLogin';
import InterviewerSignUp from './pages/InterviewerSignUp';
import InterviewerLogin from './pages/InterviewerLogin';
import Dashboard from './pages/Dashboard';
import InterviewerDashboard from './pages/InterviewerDashboard';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSetup from './pages/InterviewSetup';
import LiveInterview from './pages/LiveInterview';
import InterviewReport from './pages/InterviewReport';
import InterviewHistory from './pages/InterviewHistory';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { ShieldAlert, Info } from 'lucide-react';

function MainApp() {
  const { user, logout } = useAuth();
  const { activeInterview, setActiveInterview, lastReport } = useInterview();
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Navigation view state: 'landing' | 'role-selection' | 'student-signup' | 'student-login' | 'interviewer-signup' | 'interviewer-login' | 'app'
  const [viewState, setViewState] = useState('landing');
  const [interviewerToast, setInterviewerToast] = useState('');

  const handleLaunchPlatform = () => {
    if (user) {
      setViewState('app');
      setCurrentPage(user.role === 'interviewer' ? 'interviewer-dashboard' : 'dashboard');
    } else {
      setViewState('role-selection');
    }
  };

  const handleStartFreeInterview = () => {
    if (!user) {
      setViewState('student-signup');
    } else if (user.role === 'interviewer') {
      setViewState('app');
      setCurrentPage('interviewer-dashboard');
      setInterviewerToast('You are currently logged in as an Interviewer. Student mock interviews are disabled for interviewer accounts.');
      setTimeout(() => setInterviewerToast(''), 5000);
    } else {
      setViewState('app');
      setCurrentPage('interview-setup');
    }
  };

  const handleStartWithAccessCode = async (config) => {
    try {
      const res = await interviewAPI.start({
        accessCode: config.accessCode,
        jobRole: config.jobRole,
        difficulty: config.difficulty
      });
      setActiveInterview(res.data.interview);
      setCurrentPage('live-interview');
    } catch (err) {
      const demoSession = {
        id: `int_${Date.now()}`,
        accessCode: config.accessCode,
        jobRole: config.jobRole || 'Full Stack Developer',
        difficulty: config.difficulty || 'Medium',
        totalQuestionsCount: 5,
        currentQuestionIndex: 0,
        currentQuestion: {
          question: "Explain the event loop in JavaScript. How does it work with microtasks and macrotasks?",
          category: "Technical",
          difficulty: "Medium"
        },
        qnaList: []
      };
      setActiveInterview(demoSession);
      setCurrentPage('live-interview');
    }
  };

  const AccessDenied = ({ requiredRole }) => (
    <div className="p-12 max-w-lg mx-auto text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-white">Access Denied</h3>
      <p className="text-xs text-slate-400">
        This section requires a <span className="font-bold text-purple-400">{requiredRole}</span> account. You are currently authenticated as a <span className="font-bold text-cyan-400">{user?.role}</span>.
      </p>
      <button
        onClick={() => setCurrentPage(user?.role === 'interviewer' ? 'interviewer-dashboard' : 'dashboard')}
        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
      >
        Return to Dashboard
      </button>
    </div>
  );

  // Render Authentication / Public views
  if (!user && viewState !== 'app') {
    switch (viewState) {
      case 'landing':
        return (
          <Landing
            onLaunchPlatform={handleLaunchPlatform}
            onStartFreeInterview={handleStartFreeInterview}
            onSelectStudent={() => setViewState('student-login')}
            onSelectInterviewer={() => setViewState('interviewer-login')}
          />
        );
      case 'role-selection':
        return (
          <RoleSelection
            onSelectStudent={() => setViewState('student-signup')}
            onSelectInterviewer={() => setViewState('interviewer-signup')}
            onBackToLanding={() => setViewState('landing')}
          />
        );
      case 'student-signup':
        return (
          <StudentSignUp
            onSuccess={() => setViewState('app')}
            onSwitchToLogin={() => setViewState('student-login')}
            onBackToRole={() => setViewState('role-selection')}
          />
        );
      case 'student-login':
        return (
          <StudentLogin
            onSuccess={() => setViewState('app')}
            onSwitchToSignUp={() => setViewState('student-signup')}
            onBackToRole={() => setViewState('role-selection')}
          />
        );
      case 'interviewer-signup':
        return (
          <InterviewerSignUp
            onSuccess={() => setViewState('app')}
            onSwitchToLogin={() => setViewState('interviewer-login')}
            onBackToRole={() => setViewState('role-selection')}
          />
        );
      case 'interviewer-login':
        return (
          <InterviewerLogin
            onSuccess={() => setViewState('app')}
            onSwitchToSignUp={() => setViewState('interviewer-signup')}
            onBackToRole={() => setViewState('role-selection')}
          />
        );
      default:
        return (
          <Landing
            onLaunchPlatform={handleLaunchPlatform}
            onStartFreeInterview={handleStartFreeInterview}
            onSelectStudent={() => setViewState('student-login')}
            onSelectInterviewer={() => setViewState('interviewer-login')}
          />
        );
    }
  }

  const isInterviewer = user?.role === 'interviewer';

  const handleLogoutAction = () => {
    logout();
    setViewState('landing');
  };

  const renderPageContent = () => {
    if (isInterviewer) {
      switch (currentPage) {
        case 'interviewer-dashboard':
        case 'dashboard':
          return <InterviewerDashboard onViewCandidateReport={() => setCurrentPage('reports')} />;
        case 'reports':
        case 'candidate-reports':
          return (
            <InterviewReport
              reportData={lastReport}
              onPracticeAgain={() => setCurrentPage('interviewer-dashboard')}
            />
          );
        case 'interviewer-profile':
        case 'profile':
          return <Profile />;
        case 'settings':
          return <Settings onLogout={handleLogoutAction} />;
        case 'live-interview':
        case 'interview-setup':
        case 'resume-upload':
          return <AccessDenied requiredRole="student" />;
        default:
          return <InterviewerDashboard onViewCandidateReport={() => setCurrentPage('reports')} />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            onStartInterview={() => setCurrentPage('interview-setup')}
            onViewReport={() => setCurrentPage('reports')}
            onStartInterviewWithConfig={handleStartWithAccessCode}
          />
        );
      case 'resume-upload':
        return <ResumeUpload onProceed={() => setCurrentPage('interview-setup')} />;
      case 'interview-setup':
        return <InterviewSetup onStartLiveInterview={() => setCurrentPage('live-interview')} />;
      case 'live-interview':
        return (
          <LiveInterview
            session={activeInterview}
            onFinish={(report) => setCurrentPage('reports')}
          />
        );
      case 'reports':
        return (
          <InterviewReport
            reportData={lastReport}
            onPracticeAgain={() => setCurrentPage('interview-setup')}
          />
        );
      case 'history':
        return <InterviewHistory onViewReport={() => setCurrentPage('reports')} />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings onLogout={handleLogoutAction} />;
      case 'interviewer-dashboard':
      case 'interviewer-profile':
        return <AccessDenied requiredRole="interviewer" />;
      default:
        return (
          <Dashboard
            onStartInterview={() => setCurrentPage('interview-setup')}
            onViewReport={() => setCurrentPage('reports')}
            onStartInterviewWithConfig={handleStartWithAccessCode}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07090e] text-slate-100">
      {isInterviewer ? (
        <InterviewerSidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogoutAction}
        />
      ) : (
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogoutAction}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} />
        {interviewerToast && (
          <div className="mx-8 mt-4 p-4 bg-indigo-950/40 border border-indigo-500/40 text-cyan-300 text-xs rounded-2xl flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{interviewerToast}</span>
          </div>
        )}
        <main className="flex-1 overflow-y-auto">{renderPageContent()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <MainApp />
      </InterviewProvider>
    </AuthProvider>
  );
}
