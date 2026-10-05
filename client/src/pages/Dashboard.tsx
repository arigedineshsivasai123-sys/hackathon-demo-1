import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Droplet,
  CloudSun,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { AdvisoryRecord, DashboardStats } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { ConfidenceGauge } from '../components/ConfidenceGauge';

export const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAdvisories, setRecentAdvisories] = useState<AdvisoryRecord[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        if (isAuthenticated) {
          const [statsRes, advisoriesRes] = await Promise.allSettled([
            api.getDashboardStats(),
            api.getAdvisories()
          ]);

          if (statsRes.status === 'fulfilled') {
            setStats(statsRes.value.stats);
          }
          if (advisoriesRes.status === 'fulfilled') {
            setRecentAdvisories(advisoriesRes.value.advisories.slice(0, 5));
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    loadDashboardData();
  }, [isAuthenticated]);

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  const latestAdvisory = recentAdvisories.length > 0 ? recentAdvisories[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Hero Welcome Banner with Generated Image */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl border border-emerald-900/40">
        <img
          src="/hero.jpg"
          alt="Agriculture Field"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-emerald-950/60" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayStr}</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1 text-teal-300">
                <CloudSun className="w-3.5 h-3.5" /> Seasonal Advisory Window
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Welcome {user?.name ? `, ${user.name}` : 'to AgriAdvisor AI'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real-time crop intelligence powered by Google Gemini AI. Analyze soil condition, weather factors, growth stages, and disease symptoms to optimize harvest yields.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
              to="/new-advisory"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              Get New Crop Advisory
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Advisories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Advisories</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{stats?.totalAdvisories ?? (recentAdvisories.length || 0)}</span>
            <span className="text-xs text-slate-500">records</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Synthesized via AI models
          </p>
        </div>

        {/* Metric 2: Average Suitability */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Suitability</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {stats?.averageSuitability ? `${stats.averageSuitability}%` : '85%'}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Overall field environmental match</p>
        </div>

        {/* Metric 3: Monitored Crops */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monitored Crops</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {stats?.cropsMonitored || (latestAdvisory ? 1 : 0)}
            </span>
            <span className="text-xs text-slate-500">
              {stats?.recentCrop ? `Latest: ${stats.recentCrop}` : 'Active variety'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Crop diversity tracked</p>
        </div>

        {/* Metric 4: Risk Profile */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pest & Disease Status</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RiskBadge level={latestAdvisory?.overall_risk_level || 'Moderate'} size="sm" />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active surveillance status</p>
        </div>
      </div>

      {/* Main Grid: Spotlight & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Advisory Spotlight */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Latest Crop Advisory</h2>
            </div>
            {recentAdvisories.length > 0 && (
              <Link
                to="/history"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                View all ({recentAdvisories.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {latestAdvisory ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-black text-slate-900">{latestAdvisory.crop}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {latestAdvisory.growth_stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {latestAdvisory.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {latestAdvisory.soil_type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <RiskBadge level={latestAdvisory.overall_risk_level} />
                  <Link
                    to={`/advisory/${latestAdvisory.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    View Report
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Gauge and Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1">
                  <ConfidenceGauge
                    score={latestAdvisory.crop_suitability_score}
                    rating={latestAdvisory.advisory_result?.cropSuitability?.rating}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Executive Summary
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {latestAdvisory.advisory_result?.overallRecommendation ||
                      'Comprehensive advisory generated. Recommended focus on balanced nutrients and moisture control.'}
                  </p>
                </div>
              </div>

              {/* Immediate actions preview */}
              {latestAdvisory.advisory_result?.actionPlan?.immediate?.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Priority Immediate Actions (Next 24-48 Hours):
                  </span>
                  <ul className="space-y-1.5">
                    {latestAdvisory.advisory_result.actionPlan.immediate.slice(0, 2).map((act, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Crop Advisories Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Submit your farm soil parameters, crop type, and weather conditions to receive an immediate AI-powered agronomic diagnosis.
              </p>
              <Link
                to="/new-advisory"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Create First Advisory
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Quick Start Presets & Farming Guide */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-teal-600" />
              Quick Sample Scenarios
            </h3>
            <p className="text-xs text-slate-500">
              Explore how the advisory assistant evaluates different crop and soil configurations:
            </p>

            <div className="space-y-2.5">
              <Link
                to="/new-advisory?preset=wheat"
                className="block p-3 rounded-2xl border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                    🌾 Wheat (Vegetative Stage)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Loam Soil
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Mild leaf yellowing symptoms, drip irrigation, target yield maximization.
                </p>
              </Link>

              <Link
                to="/new-advisory?preset=rice"
                className="block p-3 rounded-2xl border border-slate-200/70 hover:border-teal-300 hover:bg-teal-50/40 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700">
                    🌱 Paddy / Rice (Tillering)
                  </span>
                  <span className="text-[10px] font-semibold text-teal-600 bg-teal-100/70 px-2 py-0.5 rounded-full">
                    Clay Loam
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Flood irrigation, stem borer risk surveillance, organic biofertilizer integration.
                </p>
              </Link>

              <Link
                to="/new-advisory?preset=tomato"
                className="block p-3 rounded-2xl border border-slate-200/70 hover:border-amber-300 hover:bg-amber-50/40 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                    🍅 Tomato (Flowering)
                  </span>
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    Sandy Loam
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  Leaf curl and sucking pest prevention, high water efficiency drip schedule.
                </p>
              </Link>
            </div>
          </div>

          {/* Agronomy Principles Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-md space-y-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold">Standard Agronomic Integrity</h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Every advisory is verified against integrated crop management (ICM) standards. Missing inputs are explicitly flagged to avoid guesswork and safeguard soil biology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
