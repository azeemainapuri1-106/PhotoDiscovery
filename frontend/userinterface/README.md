# Aura – photo discovery (React)

Your single-file app, split into a component architecture and prepared for a
Spring Boot + MySQL backend.

## Run it

```bash
npm install
cp .env.example .env     # first time only
npm run dev
```

It runs on **mock data** by default (`VITE_USE_MOCK=true`), so it behaves exactly
like the original single file.

## Folder structure

```
src/
├── main.jsx                  entry point
├── App.jsx                   container: owns state, calls hooks, passes props down
├── App.css                   page shell only
├── index.css                 global design tokens (:root variables) + reset
│
├── components/               UI only. Each component has its own .jsx + .css
│   ├── common/               Logo, Button, Icons (reused everywhere)
│   ├── layout/               Header, SearchBar, HeaderActions, Footer
│   ├── home/                 Intro, Discovery (the browsing section)
│   ├── photos/               PhotoGrid, PhotoCard, CategoryBar, EmptyState
│   └── auth/                 AuthDialog
│
├── hooks/                    logic that components share
│   ├── usePhotos             fetches photos (loading / error / retry, cancels old requests)
│   ├── useCategories         fetches category names, adds "For you"
│   ├── useFavourites         favourite ids with optimistic update + rollback
│   ├── useSearchQuery        search text <-> URL (?q=) sync
│   ├── useFocusShortcut      "/" focuses the search box
│   └── useDebounce           waits until typing stops before searching
│
├── services/                 the ONLY place that talks to the backend
│   ├── apiClient.js          fetch wrapper: base URL, JSON, auth token, errors
│   ├── photoService.js
│   ├── categoryService.js
│   ├── favouriteService.js
│   └── authService.js        ready, UI not connected yet
│
├── config/env.js             reads .env (USE_MOCK, API_BASE_URL, ...)
├── constants/                DEFAULT_CATEGORY, AUTH_MODES
└── data/                     mock data (delete when backend is live)
```

**Rule of thumb:** components never call `fetch`. They get data from hooks, hooks
get it from services, services call `apiClient`.

```
Component -> Hook -> Service -> apiClient -> Spring Boot
```

## Switching to the real backend

1. In `.env` set `VITE_USE_MOCK=false`.
2. Set `VITE_DEV_PROXY_TARGET` to your Spring Boot URL (default `http://localhost:8080`).
   The dev server forwards `/api/*` there, so you don't need CORS during development.
3. Make your API match the contract below (or adjust the `normalize...` function /
   endpoint path inside the matching service file – nothing else needs to change).

### Suggested endpoints

| Method | URL | Returns |
|---|---|---|
| GET | `/api/photos?q=&category=` | `[ { id, title, photographer, category, image, ratio } ]` |
| GET | `/api/categories` | `[ "Nature", "Interiors", ... ]` |
| GET | `/api/favourites` | `[ photoId, ... ]` (logged-in user) |
| POST | `/api/favourites/{photoId}` | 201 / 204 |
| DELETE | `/api/favourites/{photoId}` | 204 |
| POST | `/api/auth/register` | `{ token, user }` |
| POST | `/api/auth/login` | `{ token, user }` |
| GET | `/api/auth/me` | `{ id, name, email }` |

Errors: return JSON like `{ "message": "..." }` – it is shown to the user.

`ratio` must be `"portrait"` or `"landscape"` (store it in the photos table, or
compute it from image width/height on the backend).

### Spring Boot notes

- In **production** (frontend and API on different domains) enable CORS, e.g.
  `@CrossOrigin` or a `WebMvcConfigurer` allowing your frontend origin.
- Search/filter should happen **in SQL** (`WHERE title LIKE ... AND category = ...`)
  and add pagination (`page`, `size`) once you have many photos.
- Auth: the client already sends `Authorization: Bearer <token>` when a token is
  saved under `aura_token` in localStorage.

## Where to add things later

- **Login/Sign-up form** -> `components/auth/AuthDialog.jsx`, call `authService`.
  Then add an `AuthContext` so the header can show the user instead of Log in / Sign up.
- **Pagination / infinite scroll** -> extend `usePhotos` and `photoService.getPhotos`.
- **Routing** (`react-router`) -> the app currently uses `history.pushState` for `?q=`;
  `useSearchQuery` is the only place to change.
- **Photo download** -> the `download` attribute is ignored for cross-origin
  images. When photos come from your backend, add `GET /api/photos/{id}/download`
  and point the Download link at it.
