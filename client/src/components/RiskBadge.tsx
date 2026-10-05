import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: 'Low' | 'Moderate' | 'High' | 'Critical' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const normalized = level?.toLowerCase() || 'moderate';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2'
  }[size];

  if (normalized === 'low') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs ${sizeClasses}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Low Risk
      </span>
    );
  }

  if (normalized === 'moderate' || normalized === 'medium') {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs ${sizeClasses}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Moderate Risk
      </span>
    );
  }

  if (normalized === 'high') {
    return (
      <span className={`inline-flex items-center rounded-full bg-orange-50 text-orange-700 border border-orange-200/80 shadow-xs ${sizeClasses}`}>
        <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
        High Risk
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs ${sizeClasses}`}>
      <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
      Critical Risk
    </span>
  );
};
