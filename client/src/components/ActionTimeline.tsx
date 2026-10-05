import React, { useState } from 'react';
import { Clock, Calendar, Compass, CheckCircle2 } from 'lucide-react';

interface ActionTimelineProps {
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export const ActionTimeline: React.FC<ActionTimelineProps> = ({ actionPlan }) => {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) => {
    setCompleted(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: 'Immediate Actions',
      timeframe: 'Next 24 – 48 Hours',
      icon: Clock,
      color: 'bg-rose-50 border-rose-200 text-rose-700',
      badgeColor: 'bg-rose-600 text-white',
      items: actionPlan.immediate || [],
      prefix: 'imm'
    },
    {
      title: 'Short-Term Actions',
      timeframe: 'Next 1 – 2 Weeks',
      icon: Calendar,
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      badgeColor: 'bg-amber-600 text-white',
      items: actionPlan.shortTerm || [],
      prefix: 'short'
    },
    {
      title: 'Long-Term / Seasonal Management',
      timeframe: 'Harvest & Rotation',
      icon: Compass,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      badgeColor: 'bg-emerald-600 text-white',
      items: actionPlan.longTerm || [],
      prefix: 'long'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sections.map(section => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className={`rounded-2xl border p-5 bg-white shadow-xs flex flex-col transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${section.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{section.title}</h4>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {section.timeframe}
                    </span>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${section.badgeColor}`}>
                  {section.items.length} tasks
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {section.items.map((item, idx) => {
                  const itemKey = `${section.prefix}-${idx}`;
                  const isDone = completed[itemKey];

                  return (
                    <div
                      key={itemKey}
                      onClick={() => toggleCheck(itemKey)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isDone
                          ? 'bg-slate-50/80 border-slate-200/50 text-slate-400 line-through'
                          : 'bg-slate-50/40 border-slate-200/70 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${isDone ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}`}
                        />
                      </button>
                      <span className="text-xs leading-relaxed select-none">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
