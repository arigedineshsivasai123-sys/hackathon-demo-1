import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Sprout,
  MapPin,
  Calendar,
  ArrowRight,
  Trash2,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import type { AdvisoryRecord } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';

export const AdvisoryHistory: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [advisories, setAdvisories] = useState<AdvisoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        if (isAuthenticated) {
          const res = await api.getAdvisories();
          setAdvisories(res.advisories);
        }
      } catch (err) {
        console.error('Failed to load advisories history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [isAuthenticated]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Are you sure you want to permanently delete this advisory record?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteAdvisory(id);
      setAdvisories(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      alert('Failed to delete advisory: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = advisories.filter(item => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.farm_name && item.farm_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRisk =
      riskFilter === 'ALL' || item.overall_risk_level.toUpperCase() === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            Field Diagnostics Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Crop Advisory History
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review past agronomic evaluations, risk histories, and track recommendations over the cropping cycle.
          </p>
        </div>

        <Link
          to="/new-advisory"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          New Advisory
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by crop, location, or farm..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-semibold shrink-0">Risk Filter:</span>
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden font-medium"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* History List / Cards */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading previous advisories...</p>
        </div>
      ) : !isAuthenticated ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Sign In to Save & View History</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Create an account or sign in to keep permanent records of your farm's advisory reports and monitor crop health over multiple seasons.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/login"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Create Account
            </Link>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Sprout className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm || riskFilter !== 'ALL' ? 'No Matching Advisories Found' : 'No Advisory Records Yet'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {searchTerm || riskFilter !== 'ALL'
              ? 'Try adjusting your search criteria or resetting the risk filter.'
              : 'Submit your first farm diagnosis to unlock personalized crop intelligence and action plans.'}
          </p>
          <Link
            to="/new-advisory"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Generate New Advisory
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(record => {
            const dateStr = new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }).format(new Date(record.created_at));

            const isDeletingThis = deletingId === record.id;

            return (
              <div
                key={record.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <RiskBadge level={record.overall_risk_level} size="sm" />
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {record.crop}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-600">
                        {record.growth_stage}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{record.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {record.advisory_result?.overallRecommendation ||
                      'Comprehensive agronomic assessment and action schedule.'}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">Suitability Match:</span>
                    <span className="font-extrabold text-emerald-700">
                      {record.crop_suitability_score}% ({record.advisory_result?.cropSuitability?.rating || 'Good'})
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={e => handleDelete(record.id, e)}
                    disabled={isDeletingThis}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/advisory/${record.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                  >
                    View Report
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
