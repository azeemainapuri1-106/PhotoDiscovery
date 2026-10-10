# PhotoDiscovery backend

Spring Boot 3 / Java 17 REST API for PhotoDiscovery. It uses MySQL for persistent
accounts, photos, favourites, download history, and per-user download quotas.

## Configuration

Set these environment variables before starting the application:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DB_URL` | Yes | JDBC URL, for example `jdbc:mysql://localhost:3306/PhotoDiscoveryDb` |
| `DB_USERNAME` | Yes | MySQL username |
| `DB_PASSWORD` | Yes | MySQL password |
| `JWT_SECRET` | Yes | At least 32 UTF-8 bytes used to sign HS256 access tokens |
| `UNSPLASH_ACCESS_KEY` | Yes | Server-side Unsplash API access key |
| `UNSPLASH_SECRET_KEY` | No | Configured for deployment; standard server API requests use the access key |
| `APP_CORS_ALLOWED_ORIGIN` | No | Browser origin allowed by CORS; defaults to `http://localhost:5173` |
| `JWT_TTL_SECONDS` | No | Access token lifetime; defaults to 86400 seconds |

Do not commit real credentials. The application refuses to start when `JWT_SECRET`
is missing or shorter than 32 UTF-8 bytes. The database schema is managed by
Flyway migrations in `src/main/resources/db/migration`.

For local development, create the MySQL database first, set the environment
variables above, then run:

```powershell
.\mvnw.cmd spring-boot:run
```

The React app can call this API by setting `VITE_USE_MOCK=false` and pointing
`VITE_DEV_PROXY_TARGET` at the backend.

## API

| Method | Endpoint | Access |
| --- | --- | --- |
| `GET` | `/api/photos?q=&category=&page=&per_page=` | Public |
| `GET` | `/api/photos/{id}` | Public |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/auth/me` | Bearer token |
| `POST` | `/api/photos/{id}/download` | Bearer token |
| `GET` | `/api/downloads/quota` | Bearer token |
| `GET` | `/api/downloads/history` | Bearer token |
| `GET` | `/api/favourites` | Bearer token |
| `POST` | `/api/favourites/{photoId}` | Bearer token |
| `DELETE` | `/api/favourites/{photoId}` | Bearer token |
| `GET` | `/api/categories` | Public |

Downloads are serialized per account using a pessimistic database row lock.
After the third successful download, a new download is available 24 hours later.
Quota errors return HTTP 429 and include `locked_until` plus a `Retry-After`
header.

Run tests with `.\mvnw.cmd test`. Tests use an in-memory H2 database and do not
need MySQL or real Unsplash credentials.
