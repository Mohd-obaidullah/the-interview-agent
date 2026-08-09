import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Settings as SettingsIcon, Lock, Bell, Moon, LogOut, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Settings({ onLogout }) {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Preference Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [evaluationAlerts, setEvaluationAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword
      });
      setMsg(res.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 border border-purple-500/20">
          <SettingsIcon className="w-3.5 h-3.5" /> System Preferences
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-1">Account & System Settings</h2>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {msg}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* 1. Change Password Section */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Change Password</h3>
            <p className="text-xs text-slate-400">Update your account password securely</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* 2. Notification Preferences */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
            <p className="text-xs text-slate-400">Manage email and platform alert notifications</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white">Email AI Evaluation Reports</h4>
              <p className="text-[11px] text-slate-400">Receive copies of final report summaries</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white">Interview Activity Alerts</h4>
              <p className="text-[11px] text-slate-400">Notifications on new candidate submissions</p>
            </div>
            <input
              type="checkbox"
              checked={evaluationAlerts}
              onChange={(e) => setEvaluationAlerts(e.target.checked)}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Theme Preferences & Logout */}
      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Theme & Session Controls</h3>
            <p className="text-xs text-slate-400">Customize interface theme or sign out</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white">Dark Navy Glassmorphism Theme</h4>
              <p className="text-[11px] text-slate-400">Default dark mode UI aesthetic</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 font-bold text-[10px]">Active</span>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" /> Log Out of Account
          </button>
        </div>
      </div>
    </div>
  );
}
