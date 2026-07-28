/* ===== API LAYER ===== */
const API_BASE = 'http://localhost:8000/api';

const api = {
  async request(method, endpoint, data = null, auth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = localStorage.getItem('access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const opts = { method, headers };
    if (data) opts.body = JSON.stringify(data);

    let res = await fetch(`${API_BASE}${endpoint}`, opts);

    // Auto-refresh on 401
    if (res.status === 401 && auth) {
      const refreshed = await api.refreshToken();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
        res = await fetch(`${API_BASE}${endpoint}`, { ...opts, headers });
      } else {
        localStorage.clear();
        window.location.href = 'login.html';
        return;
      }
    }

    if (!res.ok && res.status !== 204) {
      const err = await res.json().catch(() => ({}));
      throw { status: res.status, data: err };
    }

    if (res.status === 204) return null;
    return res.json();
  },

  async refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem('access_token', data.access);
      return true;
    } catch { return false; }
  },

  get: (ep, auth) => api.request('GET', ep, null, auth),
  post: (ep, data, auth) => api.request('POST', ep, data, auth),
  put: (ep, data, auth) => api.request('PUT', ep, data, auth),
  patch: (ep, data, auth) => api.request('PATCH', ep, data, auth),
  delete: (ep, auth) => api.request('DELETE', ep, null, auth),
};

/* ===== SERVICES ===== */
const authService = {
  login: (email, password) => api.post('/users/login/', { email, password }, false),
  me: () => api.get('/users/me/'),
};

const userService = {
  getAll: (page = 1, search = '') => api.get(`/users/?page=${page}&search=${encodeURIComponent(search)}`),
  getById: (id) => api.get(`/users/${id}/`),
  create: (data) => api.post('/users/', data),
  update: (id, data) => api.put(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
};

const paymentService = {
  getAll: (page = 1, search = '', status = '') => {
    let url = `/payments/?page=${page}&search=${encodeURIComponent(search)}`;
    if (status && status !== 'all') url += `&payment_status=${status}`;
    return api.get(url);
  },
  create: (data) => api.post('/payments/', data),
  update: (id, data) => api.put(`/payments/${id}/`, data),
  delete: (id) => api.delete(`/payments/${id}/`),
  markPaid: (id, data) => api.post(`/payments/${id}/mark_paid/`, data),
};

const dashboardService = {
  getStats: () => api.get('/dashboard/stats/'),
  getRevenueStats: () => api.get('/dashboard/revenue_stats/'),
  getPaymentStatusBreakdown: () => api.get('/dashboard/payment_status_breakdown/'),
  getRecentPayments: () => api.get('/dashboard/recent_payments/'),
  getNewMembers: () => api.get('/dashboard/new_members/'),
};
