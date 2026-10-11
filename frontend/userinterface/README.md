# PhotoDiscovery frontend

Component-based React application integrated with the Spring Boot API.

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

The Vite proxy forwards `/api/*` to `VITE_DEV_PROXY_TARGET` (default
`http://localhost:8080`). Configure `VITE_GOOGLE_CLIENT_ID` in `.env` and the
same client ID as `GOOGLE_CLIENT_ID` in the backend environment to enable Google
sign-in.

### Configure Google Identity Services

1. In Google Cloud Console, create or select an OAuth 2.0 **Web application**
   client ID and add the frontend URL (for local development,
   `http://localhost:5173`) under **Authorized JavaScript origins**.
2. Copy `.env.example` to `.env` and set
   `VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com`.
3. Set `GOOGLE_CLIENT_ID` to that same value in the Spring Boot server
   environment. The backend verifies the ID token's signature, issuer and
   audience before issuing its own application JWT.
4. Restart Vite after editing `.env`. The GIS script is loaded from
   `https://accounts.google.com/gsi/client`; the official button sends its ID
   token to `POST /api/auth/google`.

## API integration

Components use hooks and services; only `src/services/apiClient.js` sends API
requests. The client attaches the stored JWT, parses structured API errors, and
clears expired tokens.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/photos?page=0&perPage=20` | Initial gallery |
| GET | `/api/photos/search?q={keyword}&page=0` | Debounced search |
| GET | `/api/photos/{id}` | Photo detail |
| POST | `/api/photos/{id}/download` | Download and quota tracking |
| GET | `/api/downloads/quota` | Profile quota |
| GET | `/api/downloads/history` | Download history |
| GET/POST/DELETE | `/api/favourites[/{photoId}]` | Saved photos |
| POST | `/api/auth/register`, `/api/auth/login` | Email authentication |
| POST | `/api/auth/google` | Verify a Google Identity Services ID token |
| GET | `/api/auth/me` | Restore the authenticated session |

The backend returns photo image URLs; the frontend does not call the image
provider API. For production deployments, set `VITE_API_BASE_URL` to the
backend API base and configure `photodiscovery.cors.allowed-origin` to the
frontend origin.
