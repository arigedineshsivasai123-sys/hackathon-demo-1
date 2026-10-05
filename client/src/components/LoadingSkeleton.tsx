import React, { useState, useEffect } from 'react';
import { Sprout, Sparkles, Cpu, Layers } from 'lucide-react';

interface AdvisoryLoadingProps {
  crop?: string;
}

export const AdvisoryLoading: React.FC<AdvisoryLoadingProps> = ({ crop = 'Crop' }) => {
  const steps = [
    'Parsing Farm Topography & Soil Chemistry...',
    `Evaluating ${crop} Phenological Growth Stage...`,
    'Correlating Microclimatic Weather & Thermal Stress...',
    'Synthesizing Integrated Pest & Pathogen Control...',
    'Balancing N-P-K Nutrients & Irrigation Schedules...',
    'Consulting Gemini AI Agronomic Models...',
    'Formatting Structured Decision Support Report...'
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-8 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-xl max-w-2xl mx-auto my-12 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-pulse">
          <Sprout className="w-10 h-10 animate-bounce" />
        </div>
        <div className="absolute -top-1 -right-1 bg-amber-400 p-1.5 rounded-full shadow-md animate-spin">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-slate-900 mb-2">
        Generating Agronomic Intelligence
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        Our AI agronomist is processing field parameters through Gemini models to synthesize optimal crop guidance.
      </p>

      {/* Progress status */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-5 border border-slate-200">
        <div
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 h-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(95, ((currentStepIndex + 1) / steps.length) * 100)}%` }}
        />
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50/80 border border-emerald-200/60 rounded-full text-emerald-800 text-xs font-semibold">
        <Cpu className="w-4 h-4 animate-spin text-emerald-600" />
        <span>{steps[currentStepIndex]}</span>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 w-full pt-6 border-t border-slate-100 text-xs text-slate-400">
        <div className="flex items-center justify-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Multi-layer Soil Logic</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Gemini 2.5 Flash</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Sprout className="w-3.5 h-3.5 text-emerald-500" />
          <span>Expert Validation</span>
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-slate-200 rounded-md w-1/3" />
        <div className="h-6 bg-slate-200 rounded-full w-20" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded-md w-full" />
        <div className="h-4 bg-slate-100 rounded-md w-4/5" />
      </div>
      <div className="pt-4 border-t border-slate-100 flex justify-between">
        <div className="h-4 bg-slate-200 rounded-md w-1/4" />
        <div className="h-4 bg-slate-200 rounded-md w-1/6" />
      </div>
    </div>
  );
};
