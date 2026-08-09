import React from 'react';

export default function StatCard({ title, value, badgeText, badgeColor, icon: Icon, trend }) {
  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {badgeText && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor || 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {badgeText}
          </span>
        )}
      </div>

      {trend && (
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <span className="text-emerald-400 font-semibold">{trend}</span> vs previous session
        </p>
      )}
    </div>
  );
}
