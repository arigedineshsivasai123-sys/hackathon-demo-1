import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Database,
  Key,
  CheckCircle2,
  AlertCircle,
  Save,
  Server,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [health, setHealth] = useState<{
    status: string;
    postgresActive: boolean;
    geminiKeySet: boolean;
    environment: string;
  } | null>(null);

  const [loadingHealth, setLoadingHealth] = useState(true);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keyUpdateMsg, setKeyUpdateMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSavingKey, setIsSavingKey] = useState(false);

  const checkHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch {
      setHealth(null);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    setIsSavingKey(true);
    setKeyUpdateMsg(null);

    try {
      const res = await api.updateGeminiKey(apiKeyInput.trim());
      setKeyUpdateMsg({ text: res.message, type: 'success' });
      setApiKeyInput('');
      checkHealth();
    } catch (err: any) {
      setKeyUpdateMsg({ text: err.message || 'Failed to update key', type: 'error' });
    } finally {
      setIsSavingKey(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
          <SettingsIcon className="w-3.5 h-3.5" />
          System & Configuration
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Assistant Settings & Diagnostics
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Monitor database connectivity, AI engine models, and configure Google Gemini API credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Diagnostics Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">System Diagnostics</h2>
            </div>
            <button
              onClick={checkHealth}
              disabled={loadingHealth}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-colors"
              title="Refresh health"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHealth ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Backend Status */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">REST API Server</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                {health ? 'Online (HTTP 200)' : 'Checking...'}
              </span>
            </div>

            {/* Database Status */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-teal-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Database Engine</div>
                  <div className="text-[10px] text-slate-400">PostgreSQL compatibility</div>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  health?.postgresActive
                    ? 'text-teal-700 bg-teal-100/80'
                    : 'text-emerald-700 bg-emerald-100/80'
                }`}
              >
                {health?.postgresActive ? 'PostgreSQL Active' : 'Persistent SQL Store'}
              </span>
            </div>

            {/* Gemini AI Status */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Gemini AI Model</div>
                  <div className="text-[10px] text-slate-400">@google/genai SDK</div>
                </div>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  health?.geminiKeySet
                    ? 'text-emerald-700 bg-emerald-100/80'
                    : 'text-amber-700 bg-amber-100/80'
                }`}
              >
                {health?.geminiKeySet ? 'Gemini 2.5 Flash Active' : 'Agronomic Engine Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Gemini API Key Configuration Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Key className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Google Gemini API Key</h2>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            You can set <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">GEMINI_API_KEY</code> in your root <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">.env</code> file, or input it directly below for instant activation in this session.
          </p>

          {keyUpdateMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                keyUpdateMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {keyUpdateMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{keyUpdateMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSaveApiKey} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Enter Gemini API Key</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingKey || !apiKeyInput.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSavingKey ? 'Saving...' : 'Apply Key'}
            </button>
          </form>
        </div>
      </div>

      {/* User Session Info */}
      {user && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{user.name}</div>
              <div className="text-xs text-slate-400">{user.email}</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Authenticated Session
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
