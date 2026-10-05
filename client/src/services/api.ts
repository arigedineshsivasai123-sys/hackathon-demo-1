import type { AdvisoryInputPayload, AdvisoryRecord, DashboardStats, User } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('agri_auth_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const data = await request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('agri_auth_token', data.token);
    return data;
  },

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const data = await request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    localStorage.setItem('agri_auth_token', data.token);
    return data;
  },

  async getMe(): Promise<{ user: User }> {
    return request<{ user: User }>('/auth/me');
  },

  logout(): void {
    localStorage.removeItem('agri_auth_token');
  },

  async updateGeminiKey(apiKey: string): Promise<{ message: string }> {
    return request<{ message: string }>('/auth/config/gemini-key', {
      method: 'POST',
      body: JSON.stringify({ apiKey })
    });
  },

  // Advisory
  async generateAdvisory(payload: AdvisoryInputPayload): Promise<{ advisory: AdvisoryRecord }> {
    return request<{ advisory: AdvisoryRecord }>('/advisory/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAdvisories(): Promise<{ advisories: AdvisoryRecord[] }> {
    return request<{ advisories: AdvisoryRecord[] }>('/advisory');
  },

  async getAdvisoryById(id: string): Promise<{ advisory: AdvisoryRecord }> {
    return request<{ advisory: AdvisoryRecord }>(`/advisory/${id}`);
  },

  async deleteAdvisory(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/advisory/${id}`, {
      method: 'DELETE'
    });
  },

  async getDashboardStats(): Promise<{ stats: DashboardStats }> {
    return request<{ stats: DashboardStats }>('/advisory/stats/summary');
  },

  async getHealth(): Promise<{
    status: string;
    postgresActive: boolean;
    geminiKeySet: boolean;
    environment: string;
  }> {
    return request<{
      status: string;
      postgresActive: boolean;
      geminiKeySet: boolean;
      environment: string;
    }>('/health');
  }
};
