import React from 'react';

export default function VoiceWaveform({ isListening }) {
  return (
    <div className="flex items-center justify-center space-x-1.5 h-10 my-2">
      {[40, 70, 30, 90, 50, 80, 45, 95, 60, 30, 75, 40].map((height, idx) => (
        <div
          key={idx}
          className={`w-1 rounded-full bg-gradient-to-t from-purple-600 to-indigo-400 transition-all duration-300 ${
            isListening ? 'animate-bounce' : 'opacity-40'
          }`}
          style={{
            height: isListening ? `${height}%` : '20%',
            animationDelay: `${idx * 0.1}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
}
