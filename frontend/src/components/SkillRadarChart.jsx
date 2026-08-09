import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const defaultData = [
  { subject: 'JavaScript', A: 85, fullMark: 100 },
  { subject: 'React', A: 78, fullMark: 100 },
  { subject: 'Node.js', A: 72, fullMark: 100 },
  { subject: 'System Design', A: 65, fullMark: 100 },
  { subject: 'SQL', A: 70, fullMark: 100 },
  { subject: 'Problem Solving', A: 88, fullMark: 100 },
];

export default function SkillRadarChart({ data = defaultData }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
          <Radar
            name="Skill Score"
            dataKey="A"
            stroke="#8b5cf6"
            fill="#7c3aed"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
