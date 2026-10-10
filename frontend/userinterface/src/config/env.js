// Single place that reads environment variables.
// Everything else in the app imports from here, never from import.meta.env directly.

// When true, services return local mock data instead of calling the backend.
// Defaults to true so the app runs out of the box. Set VITE_USE_MOCK=false to go live.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// Base URL for all API requests.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

// localStorage key where the auth token (e.g. JWT) will be stored after login.
export const AUTH_TOKEN_KEY = 'aura_token'

// How long (ms) to wait after the user stops typing before searching.
export const SEARCH_DEBOUNCE_MS = 300
