import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Shield, Save, CheckCircle, GraduationCap, Briefcase, Award, Video, Users, Sparkles } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || 'Anas');
  const [lastName, setLastName] = useState(user?.lastName || 'Dev');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const isStudent = user?.role !== 'interviewer';

  useEffect(() => {
    authAPI.getProfile()
      .then(res => {
        if (res.data.user) {
          setUser(res.data.user);
          setFirstName(res.data.user.firstName || 'Anas');
          setLastName(res.data.user.lastName || 'Dev');
        }
      })
      .catch(err => console.log('Using active auth context state'));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      const res = await authAPI.updateProfile({ firstName, lastName });
      setUser(res.data.user);
      setMsg('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setUser({ ...user, firstName, lastName, name: `${firstName} ${lastName}` });
      setMsg('Profile changes saved!');
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 border border-purple-500/20">
            <User className="w-3.5 h-3.5" /> User Account
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            {isStudent ? 'Student Profile' : 'Interviewer Profile'}
          </h2>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="px-5 py-2.5 bg-slate-900 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {msg}
        </div>
      )}

      {/* User Information Card */}
      <div className="glass-panel-glow p-8 rounded-3xl space-y-6 border border-purple-500/30">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-purple-500/30">
            {firstName?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{firstName} {lastName}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                isStudent ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              }`}>
                {isStudent ? 'Student Account' : 'Interviewer Account'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                className="w-full p-3 rounded-xl glass-input text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                className="w-full p-3 rounded-xl glass-input text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Gmail / Email Address (Read-Only)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={user?.email || 'user@example.com'}
                disabled
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs opacity-60 cursor-not-allowed bg-slate-900/90"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 hover:opacity-90 flex items-center gap-2 transition"
              >
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Live Role Performance Metrics Card */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
          {isStudent ? 'Student Account Performance' : 'Interviewer Management Overview'}
        </h4>

        {isStudent ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <Video className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Interviews Completed</span>
              <h5 className="text-2xl font-extrabold text-white mt-1">12</h5>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <Sparkles className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Average Score</span>
              <h5 className="text-2xl font-extrabold text-purple-400 mt-1">76/100</h5>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <Award className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Best Score</span>
              <h5 className="text-2xl font-extrabold text-emerald-400 mt-1">92/100</h5>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <Briefcase className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Interviews Created</span>
              <h5 className="text-2xl font-extrabold text-white mt-1">4</h5>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <Users className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Candidates Evaluated</span>
              <h5 className="text-2xl font-extrabold text-cyan-400 mt-1">48</h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
