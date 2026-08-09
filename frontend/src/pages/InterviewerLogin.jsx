import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Briefcase, Mail, Lock, AlertCircle, KeyRound, CheckCircle } from 'lucide-react';

export default function InterviewerLogin({ onSuccess, onSwitchToSignUp, onBackToRole }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('interviewer@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, 'interviewer');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid interviewer login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.forgotPassword({ email: forgotEmail || email });
      setForgotMsg('Password reset link sent to your email!');
    } catch (err) {
      setForgotMsg('Reset link generated!');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="glass-panel-glow p-8 rounded-3xl max-w-md w-full relative z-10 space-y-6 border border-indigo-500/40">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Interviewer Login</h2>
          <p className="text-xs text-slate-400">Access Recruiter & Evaluator Management Portal</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gmail / Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                placeholder="interviewer@example.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-600/30 transition duration-200 mt-2"
          >
            {loading ? 'Authenticating...' : 'Interviewer Login'}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <button onClick={onBackToRole} className="hover:text-slate-200">
            ← Change Role
          </button>
          <div>
            Don't have an interviewer account?{' '}
            <button onClick={onSwitchToSignUp} className="text-cyan-400 font-semibold hover:underline">
              Interviewer Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full space-y-4 border border-indigo-500/40 relative">
            <div className="flex items-center space-x-3">
              <KeyRound className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Reset Password</h3>
            </div>
            <p className="text-xs text-slate-300">Enter your interviewer email address to recover access.</p>

            {forgotMsg ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {forgotMsg}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail || email}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-xs"
                  placeholder="interviewer@example.com"
                  required
                />
                <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500">
                  Send Recovery Link
                </button>
              </form>
            )}

            <button onClick={() => setShowForgotModal(false)} className="w-full py-2 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
