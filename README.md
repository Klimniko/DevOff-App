# DevOff Commission Calculator

A full-stack commission calculator for software development projects. The application enables developers to authenticate securely, capture project financials, convert currencies in real time, and generate exports for reporting.

## Architecture Overview

- **Frontend**: React 18 + Vite + Tailwind CSS for a responsive dashboard UI.
- **Backend**: Node.js + Express with RESTful endpoints, JWT auth, and export utilities.
- **Database**: MySQL 8 with normalized tables and indexes for performance.
- **Currency Service**: External USD→EUR API with 10-minute caching and manual refresh.

## Prerequisites

- Node.js 18+ (run `nvm use` to load the pinned version from `.nvmrc`)
- npm 9+
- MySQL 8+

## Project Structure

```
project-root/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── database/               # SQL schema and seeds
├── .env.example            # Environment template
└── README.md
```

## Environment Configuration

1. Copy `.env.example` to `.env` in the project root.
2. Update the following variables:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`
   - `CURRENCY_API_KEY`, `CURRENCY_API_URL`
   - `CLIENT_ORIGIN` (comma separated list for production)

## Database Setup

```bash
mysql -u root -p < database/schema.sql
```

This creates the schema, indexes, and seeds three users:

- `kliment / kliment$`
- `hugo / hugo$`
- `arnaud / arnaud$`

## Backend Setup

```bash
cd server
npm install
npm run dev
```

The backend runs on `http://localhost:5000` with hot reload via `nodemon`.

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` for the Vite dev server.

## Production Build

1. Build the frontend bundle:
   ```bash
   cd client
   npm run build
   ```
2. Serve with the backend:
   ```bash
   cd server
   npm install --production
   NODE_ENV=production npm start
   ```

## Export Utilities

- **CSV**: `/api/export/csv/:id`
- **Excel**: `/api/export/excel/:id`
- **PDF**: `/api/export/pdf/:id`
- **Bulk**: `/api/export/bulk` with `{ "ids": [1,2], "format": "csv" }`

## Testing & Quality

- Backend linting: `npm run lint` from `/server`
- Frontend linting: `npm run lint` from `/client`
- Recommended future work: Jest unit tests, Cypress E2E.

## Known Security Advisories

- `validator@13.15.15` (transitively required by `express-validator`) is subject to [GHSA-9965-vmph-33xx](https://github.com/advisories/GHSA-9965-vmph-33xx).
  - A patched release is not yet available upstream; the project avoids the vulnerable `isURL` helper while monitoring for updates.
  - Review the advisory before production deployment and apply the recommended patch once published.

## Deployment Tips

- Use a process manager (PM2) for the backend.
- Serve the React build behind a CDN.
- Configure HTTPS and secure cookies in production.
- Schedule MySQL backups (mysqldump, point-in-time recovery).
- Monitor with tools like Grafana/Prometheus or SaaS equivalents.

## Default Credentials

| Username | Password  |
|----------|-----------|
| kliment  | kliment$  |
| hugo     | hugo$     |
| arnaud   | arnaud$   |

## API Overview

| Method | Endpoint                 | Description                        |
|--------|--------------------------|------------------------------------|
| POST   | `/api/auth/login`        | Authenticate and issue JWT         |
| POST   | `/api/auth/logout`       | Invalidate session                 |
| GET    | `/api/auth/verify`       | Validate existing session          |
| GET    | `/api/currency/rates`    | Get cached or live exchange rate   |
| GET    | `/api/currency/refresh`  | Force refresh exchange rate        |
| GET    | `/api/calculations`      | List calculations with filters     |
| POST   | `/api/calculations`      | Create new calculation             |
| GET    | `/api/calculations/:id`  | Fetch single calculation           |
| PUT    | `/api/calculations/:id`  | Update calculation                 |
| DELETE | `/api/calculations/:id`  | Remove calculation                 |
| GET    | `/api/dashboard/stats`   | Dashboard metrics                  |
| GET    | `/api/export/:format/:id`| Export individual calculation      |
| POST   | `/api/export/bulk`       | Bulk export calculations           |

## Currency API

Sign up for a free tier API key (e.g., [ExchangeRate-API](https://www.exchangerate-api.com/)). Update the `.env` values accordingly. The backend caches results and gracefully falls back to cached data if the provider is unavailable.

## Next Steps

- Configure HTTPS reverse proxy (NGINX / Traefik).
- Add automated backups and retention policies for MySQL.
- Implement comprehensive unit & integration tests.
- Set up CI/CD with automated linting, testing, and deployment.
- Extend to support multi-currency, notification emails, and role-based access.
