import React from 'react';
import { Sprout, ShieldAlert, Cpu, Database, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mandatory Advisory Notice */}
        <div className="bg-amber-950/40 border border-amber-600/30 rounded-2xl p-5 mb-10 flex items-start gap-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-300 mb-1">
              Important Agricultural Advisory Notice & Disclaimer
            </h4>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Information provided by the AI-Powered Agriculture Crop Advisory Assistant is synthesized using Google Gemini AI models and agronomic rules for decision-support purposes only. It does not replace on-site agricultural testing, government soil health cards, or certified agricultural extension officers. Users must verify local pest outbreaks, legal pesticide registrations, and weather conditions before applying chemical inputs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">CropAdvisor AI</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Empowering farmers, growers, and agricultural professionals with instant, data-driven crop intelligence, soil suitability assessments, integrated pest management, and custom irrigation guidance.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Google Gemini API
              </span>
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                PostgreSQL
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Capabilities</h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>Crop Suitability Scoring</li>
              <li>Pest & Disease Diagnosis</li>
              <li>Soil Amendment Schedule</li>
              <li>Irrigation Conservation</li>
              <li>Actionable 24-48h Timelines</li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Target Users</h5>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>Smallholder Farmers</li>
              <li>Commercial Farm Managers</li>
              <li>Agricultural Students</li>
              <li>Crop Advisors & Consultants</li>
              <li>Agri-tech Researchers</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI-Powered Agriculture Crop Advisory Assistant. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for farmers with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> and Google Gemini
          </p>
        </div>
      </div>
    </footer>
  );
};
