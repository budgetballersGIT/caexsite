const _apiRoot = (process.env.REACT_APP_API_URL || 'http://localhost:4000').trim().replace(/\/api\/?$/, '');
const API_BASE = `${_apiRoot}/api`;

export function getToken() {
  return localStorage.getItem('token');
}

export function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

// Access tokens last 15 minutes. Renew silently with the refresh token (one request at a time).
let refreshInFlight = null;
function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const json = await res.json();
      const token = json?.data?.token || json?.data?.accessToken;
      if (!res.ok || !token) throw new Error('Refresh failed');
      localStorage.setItem('token', token);
      return token;
    })().finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

export async function adminFetch(endpoint, options = {}) {
  const { method = 'GET', body, isFormData = false, _retried = false } = options;
  const token = getToken();

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  });

  if (res.status === 401 && !_retried && localStorage.getItem('refreshToken')) {
    try {
      await refreshAccessToken();
      return adminFetch(endpoint, { ...options, _retried: true });
    } catch {
      // refresh token invalid too — fall through to the normal error below
    }
  }

  const json = await res.json();
  if (!json.success) {
    const err = new Error(json.error || 'API Error');
    err.status = res.status;
    throw err;
  }
  return json.data;
}

export { API_BASE };
