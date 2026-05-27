const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getSessionId() {
  let sessionId = localStorage.getItem('retroshirt-session');

  if (!sessionId) {
    sessionId = `session-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('retroshirt-session', sessionId);
  }

  return sessionId;
}

function getStoredAuth() {
  const token = localStorage.getItem('retroshirt-token');
  const user = localStorage.getItem('retroshirt-user');

  return {
    token,
    user: user ? JSON.parse(user) : null
  };
}

function setAuthState(auth) {
  if (auth?.token) {
    localStorage.setItem('retroshirt-token', auth.token);
    localStorage.setItem('retroshirt-user', JSON.stringify(auth.user));
  } else {
    localStorage.removeItem('retroshirt-token');
    localStorage.removeItem('retroshirt-user');
  }
}

function clearAuthState() {
  localStorage.removeItem('retroshirt-token');
  localStorage.removeItem('retroshirt-user');
}

async function request(endpoint, options = {}) {
  const auth = getStoredAuth();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (auth.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao comunicar com a API' }));
    throw new Error(error.message || 'Erro ao comunicar com a API');
  }

  return response.json();
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/products${query ? `?${query}` : ''}`);
}

export async function fetchPopularProducts() {
  return request('/products/popular');
}

export async function fetchProduct(id) {
  return request(`/products/${id}`);
}

export async function login(credentials) {
  const response = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });

  setAuthState(response);
  return response;
}

export async function register(payload) {
  const response = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  setAuthState(response);
  return response;
}

export async function fetchMe() {
  const response = await request('/auth/me');
  setAuthState({ token: getStoredAuth().token, user: response.user });
  return response;
}

export async function logoutUser() {
  const token = getStoredAuth().token;

  try {
    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } finally {
    clearAuthState();
  }
}

export async function toggleFavorite(productId) {
  const sessionId = getSessionId();
  return request('/favorites', {
    method: 'POST',
    body: JSON.stringify({ sessionId, productId })
  });
}

export async function removeFavorite(productId) {
  const sessionId = getSessionId();
  return request(`/favorites/${productId}`, {
    method: 'DELETE',
    body: JSON.stringify({ sessionId })
  });
}

export async function fetchFavorites() {
  const sessionId = getSessionId();
  return request(`/favorites?sessionId=${encodeURIComponent(sessionId)}`);
}

export async function createOrder(payload) {
  const sessionId = getSessionId();
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify({ sessionId, ...payload })
  });
}

export async function registerLike(productId) {
  const sessionId = getSessionId();
  return request(`/products/${productId}/like`, {
    method: 'POST',
    body: JSON.stringify({ sessionId })
  });
}

export function getStoredUser() {
  return getStoredAuth().user;
}

export function isAuthenticated() {
  return Boolean(getStoredAuth().token);
}

export { getSessionId, getStoredAuth };