import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

interface ConfidenceGaugeProps {
  score: number;
  label?: string;
  rating?: string;
  type?: 'circular' | 'linear';
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  score,
  label = 'Suitability Score',
  rating,
  type = 'circular'
}) => {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (s >= 65) return { stroke: '#14b8a6', bg: 'bg-teal-500', text: 'text-teal-700', border: 'border-teal-200' };
    if (s >= 50) return { stroke: '#f59e0b', bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200' };
    return { stroke: '#f43f5e', bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-200' };
  };

  const theme = getColor(safeScore);

  if (type === 'linear') {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
          <div className="flex items-center gap-1.5">
            {rating && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${theme.bg}/10 ${theme.text}`}>
                {rating}
              </span>
            )}
            <span className="text-sm font-extrabold text-slate-900">{safeScore}%</span>
          </div>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className={`h-full rounded-full transition-all duration-700 ${theme.bg}`}
            style={{ width: `${safeScore}%` }}
          />
        </div>
      </div>
    );
  }

  // Circular SVG Gauge
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/70 shadow-xs">
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={theme.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-800 tracking-tight">{safeScore}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          {label}
        </div>
        <div className="text-base font-bold text-slate-900">
          {rating || (safeScore >= 80 ? 'Optimal Growth' : safeScore >= 60 ? 'Favorable' : 'Requires Intervention')}
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Calculated via Gemini AI</span>
        </div>
      </div>
    </div>
  );
};
