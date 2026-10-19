import axios from 'axios'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

export const getToken = () => {
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

export const api = axios.create({ baseURL: API_URL, timeout: 20000 })

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Expired or invalid session: let the app sign the user out.
let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && getToken() && !error.config?.url?.includes('/signin')) onUnauthorized()
    return Promise.reject(error)
  }
)

/** Human-readable message for any request error. */
export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.code === 'ECONNABORTED') return 'The server is taking too long to respond. It may be waking up. Try again in a few seconds.'
  if (error?.request && !error.response) return "Can't reach the server. Check your connection and try again."
  return fallback
}

// Users
export const usersApi = {
  signup: (body) => api.post('/users/signup', body),
  signin: (body) => api.post('/users/signin', body),
  me: () => api.get('/users'),
  search: (q) => api.get(`/users/search/${encodeURIComponent(q)}`),
  toggleFriend: (friendId) => api.post('/users/handleFriend', { friendId }),
  update: (id, body) => api.put(`/users/${id}`, body),
  leaderboard: () => api.get('/users/leaderboard'),
  onlineStatus: () => api.get('/users/online-status'),
  dismissInvite: (gameId) => api.post('/users/pending-invites/dismiss', { gameId }),
}

// Games
export const gamesApi = {
  create: () => api.post('/games'),
  get: (id) => api.get(`/games/${id}`),
  join: (id) => api.put(`/games/${id}`),
  move: (id, col) => api.put(`/games/${id}/move`, { col }),
  forfeit: (id, reason) => api.post(`/games/${id}/forfeit`, { reason }),
  rematch: (id) => api.post(`/games/${id}/rematch`),
  invite: (friendId) => api.post('/games/invite', { friendId }),
  decline: (id) => api.post(`/games/${id}/decline`),
  active: () => api.get('/games/active'),
  history: () => api.get('/games/history'),
}

export const puzzlesApi = {
  today: () => api.get('/puzzles/today'),
  solve: (move) => api.post('/puzzles/today/solve', { move }),
}

export const tournamentsApi = {
  create: (name) => api.post('/tournaments', { name }),
  get: (id) => api.get(`/tournaments/${id}`),
  join: (id) => api.put(`/tournaments/${id}/join`),
  start: (id) => api.put(`/tournaments/${id}/start`),
}
