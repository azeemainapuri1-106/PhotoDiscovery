// Single place that reads environment variables.
// Everything else in the app imports from here, never from import.meta.env directly.

// Base URL for all API requests.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '')

// localStorage key where the auth token (e.g. JWT) will be stored after login.
export const AUTH_TOKEN_KEY = 'photodiscovery_token'
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

// How long (ms) to wait after the user stops typing before searching.
export const SEARCH_DEBOUNCE_MS = 300
