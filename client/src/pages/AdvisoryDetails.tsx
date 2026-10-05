import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sprout,
  MapPin,
  Calendar,
  Layers,
  Droplet,
  CloudSun,
  AlertTriangle,
  Info,
  Printer,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import type { AdvisoryRecord } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { ConfidenceGauge } from '../components/ConfidenceGauge';
import { ActionTimeline } from '../components/ActionTimeline';
import { useAuth } from '../context/AuthContext';

export const AdvisoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [advisory, setAdvisory] = useState<AdvisoryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchAdvisory() {
      if (!id) return;
      try {
        const res = await api.getAdvisoryById(id);
        setAdvisory(res.advisory);
      } catch (err: any) {
        console.error('Failed to load advisory:', err);
        setError(err.message || 'Advisory report could not be found.');
      } finally {
        setLoading(false);
      }
    }
    fetchAdvisory();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await api.deleteAdvisory(id);
      navigate('/history');
    } catch (err: any) {
      alert('Failed to delete advisory: ' + err.message);
      setIsDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-spin">
          <Sprout className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-600">Retrieving Crop Advisory Report...</p>
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 text-sm">
          {error || 'Advisory report not found.'}
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { advisory_result: result, input_payload: input } = advisory;

  const dateFormatted = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(advisory.created_at));

  const isOwner = Boolean(user && advisory.user_id === user.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print border-b border-slate-200 pb-5">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Advisory History
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print / Export PDF
          </button>

          {isOwner && (
            <div>
              {deleteConfirm ? (
                <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-xl border border-rose-200">
                  <span className="text-xs text-rose-700 font-semibold px-2">Confirm Delete?</span>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-2.5 py-1 text-slate-600 text-xs font-semibold hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Record
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Report Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-extrabold text-xs uppercase tracking-wider border border-emerald-200/60">
                Official Advisory Report
              </span>
              <RiskBadge level={result.pestAndDiseaseRisk?.overallRiskLevel || advisory.overall_risk_level} />
              <span className="text-xs text-slate-400 font-mono">ID: {advisory.id.slice(0, 8)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {advisory.crop} Cultivation & Health Advisory
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <strong>Location:</strong> {advisory.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <strong>Report Date:</strong> {dateFormatted}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                <span>{result.aiModelUsed || 'Gemini 2.5 Flash'}</span>
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <ConfidenceGauge
              score={result.cropSuitability?.score ?? advisory.crop_suitability_score}
              rating={result.cropSuitability?.rating}
            />
          </div>
        </div>

        {/* Executive Overall Recommendation Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 p-5 rounded-2xl border border-emerald-200/80">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-emerald-900 mb-1">Overall Agronomic Assessment</h3>
              <p className="text-xs sm:text-sm text-emerald-950/90 leading-relaxed font-medium">
                {result.overallRecommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Farm & Input Profile Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Growth Stage</span>
            <span className="text-xs font-bold text-slate-800">{advisory.growth_stage}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Soil Matrix</span>
            <span className="text-xs font-bold text-slate-800">{advisory.soil_type} {input.soilPh ? `(pH ${input.soilPh})` : ''}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Irrigation Mode</span>
            <span className="text-xs font-bold text-slate-800">{input.irrigationMethod || 'Standard'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Objective</span>
            <span className="text-xs font-bold text-slate-800">{advisory.farming_objective}</span>
          </div>
        </div>
      </div>

      {/* Action Plan Timeline (Immediate, Short-Term, Long-Term) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Structured Action Plan</h2>
        </div>
        <ActionTimeline actionPlan={result.actionPlan} />
      </div>

      {/* Grid: Soil Suitability & Irrigation Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soil Suitability & Amendments */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Soil Suitability & Amendments</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {result.soilSuitability?.rating || 'Good'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {result.soilSuitability?.analysis}
          </p>

          {result.soilSuitability?.phRecommendation && (
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
              <strong>pH Guidance:</strong> {result.soilSuitability.phRecommendation}
            </div>
          )}

          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Recommended Soil Amendments:
            </span>
            <ul className="space-y-1.5">
              {result.soilSuitability?.recommendedAmendments?.map((amend, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{amend}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Irrigation & Water Management */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Irrigation & Water Conservation</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Water Need: {result.irrigationRecommendations?.waterRequirement || 'Moderate'}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div>
              <strong className="text-slate-800">Frequency Guidance:</strong> {result.irrigationRecommendations?.frequencyGuidance}
            </div>
            <div>
              <strong className="text-slate-800">Method Evaluation:</strong> {result.irrigationRecommendations?.methodEvaluation}
            </div>
            <div>
              <strong className="text-slate-800">Optimal Timing:</strong> {result.irrigationRecommendations?.timingAdvice}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Conservation & Moisture Tips:
            </span>
            <ul className="space-y-1.5">
              {result.irrigationRecommendations?.conservationTips?.map((tip, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Fertilizer & Nutrient Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Fertilizer & Nutrient Management</h3>
              <p className="text-xs text-slate-500">Targeted nutrition plan for current {advisory.growth_stage} phase</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Basal & Top Dressing */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Chemical / Mineral Program
            </h4>
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 block">Top Dressing Split:</span>
              <ul className="space-y-1 text-xs text-slate-700">
                {result.fertilizerRecommendations?.topDressing?.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Micronutrients:</span>
              <ul className="space-y-1 text-xs text-slate-700">
                {result.fertilizerRecommendations?.micronutrients?.map((micro, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span>{micro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Organic Alternatives */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Organic & Biological Options
            </h4>
            <ul className="space-y-2 text-xs text-emerald-950">
              {result.fertilizerRecommendations?.organicAlternatives?.map((org, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{org}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800">
              <strong>Application Schedule:</strong> {result.fertilizerRecommendations?.applicationTiming}
            </div>
          </div>

          {/* Nutrient Balance Status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Macronutrient Status (N-P-K)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                <span className="font-semibold text-slate-600">Nitrogen (N):</span>
                <span className="font-bold text-slate-800">{result.nutrientManagement?.nitrogenStatus}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                <span className="font-semibold text-slate-600">Phosphorus (P):</span>
                <span className="font-bold text-slate-800">{result.nutrientManagement?.phosphorusStatus}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-slate-600">Potassium (K):</span>
                <span className="font-bold text-slate-800">{result.nutrientManagement?.potassiumStatus}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1">Key Advice:</span>
              <ul className="space-y-1 text-xs text-slate-600">
                {result.nutrientManagement?.specificNutrientAdvice?.slice(0, 2).map((item, i) => (
                  <li key={i} className="leading-tight">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pest & Disease Risk Surveillance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pest & Disease Risk Diagnosis</h3>
              <p className="text-xs text-slate-500">Correlated against observed farm symptoms</p>
            </div>
          </div>
          <RiskBadge level={result.pestAndDiseaseRisk?.overallRiskLevel || 'Moderate'} />
        </div>

        {/* Identified Risks Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.pestAndDiseaseRisk?.identifiedRisks?.map((risk, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900">{risk.name}</h4>
                <RiskBadge level={risk.severity} size="sm" />
              </div>
              <p className="text-xs text-slate-600">
                <strong>Symptoms:</strong> {risk.symptoms}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800">
                <strong className="text-emerald-700 block mb-0.5">Recommended Management:</strong>
                {risk.recommendedTreatment}
              </div>
              {risk.organicRemedy && (
                <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50/80 p-2 rounded-lg">
                  <strong>Organic Alternative:</strong> {risk.organicRemedy}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preventive Measures */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
          <span className="text-xs font-bold text-slate-800 block mb-2">
            Integrated Preventive Measures & Biosecurity:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {result.preventiveMeasures?.map((meas, i) => (
              <div key={i} className="text-xs text-slate-600 flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{meas}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather Considerations & Environmental Risk Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CloudSun className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Weather-Related Considerations</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {result.weatherConsiderations?.currentImpact}
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-amber-950">
              <strong>Temperature Advisory:</strong> {result.weatherConsiderations?.temperatureGuidance}
            </div>
            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/60 text-teal-950">
              <strong>Rainfall & Moisture Advisory:</strong> {result.weatherConsiderations?.rainfallGuidance}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">Expected Risks & Mitigations</h3>
          </div>
          <div className="space-y-2.5">
            {result.expectedRisks?.map((r, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{r.category} Risk: {r.description}</span>
                  <RiskBadge level={r.severity} size="sm" />
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong>Mitigation:</strong> {r.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings & Missing Information Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Important Warnings */}
        <div className="bg-rose-50/70 rounded-3xl p-6 border border-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-black">Crucial Agricultural Warnings</h3>
          </div>
          <ul className="space-y-2 text-xs text-rose-900">
            {result.importantWarnings?.map((warn, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-rose-600">•</span>
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Information Callout */}
        <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-800">
            <Info className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-black">Information Gaps to Verify</h3>
          </div>
          <p className="text-[11px] text-amber-900">
            The AI agronomist noted the following parameters were omitted or unverified. Testing these will enhance advisory precision:
          </p>
          <ul className="space-y-1.5 text-xs text-amber-900">
            {result.missingInformation?.length > 0 ? (
              result.missingInformation.map((info, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-amber-600">→</span>
                  <span>{info}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-emerald-800 font-semibold">
                ✓ All essential field parameters were comprehensively supplied!
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Scientific Explanation & AI Reasoning */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Agronomic Scientific Reasoning</h3>
          </div>
          <div className="text-xs text-slate-500">
            AI Confidence: <strong>{result.confidenceLevel?.score}% ({result.confidenceLevel?.level})</strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          {result.scientificExplanation}
        </p>
        <p className="text-xs text-slate-500 italic">
          {result.confidenceLevel?.explanation}
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed">
        <strong>Agricultural Legal Disclaimer:</strong> {result.disclaimer}
      </div>
    </div>
  );
};
