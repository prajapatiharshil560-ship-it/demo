# Fullstack Login Demo (AdonisJS + React + MySQL)

Two apps: `backend` (AdonisJS v6 API) and `frontend` (React + Vite). Implements JWT-based authentication with protected routes and JSON APIs.

## Prerequisites
- Node 22
- MySQL 8+

## Backend (AdonisJS)

1) Configure environment
- Create `backend/.env` from this template:
```
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
LOG_LEVEL=info
APP_KEY=use_node_ace_to_generate_or_any_random_string
JWT_SECRET=change_me_strong_secret

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=demo_app
```

2) Install, migrate, run
```
cd backend
npm i
node ace generate:key   # sets APP_KEY in .env (fallback if JWT_SECRET missing)
node ace migration:run
npm run dev
```
The server runs on `http://localhost:3333`.

3) Create a user
```
node ace user:create --email demo@example.com --password secret123
```

4) API Endpoints
- POST `/api/login` → Authenticate (returns `{ token, user }`)
- POST `/api/logout` → No-op for JWT (client clears token)
- GET `/api/user` → Current user (protected, Bearer JWT)
- GET `/api/dashboard` → Mock data (protected, Bearer JWT)
- POST `/api/test` → Echo JSON payload

All responses are JSON. Protected routes require `Authorization: Bearer <JWT>` header.

## Frontend (React + Vite)

1) Configure and run
```
cd frontend
# Optional: edit .env.local to point to backend
# VITE_API_BASE_URL=http://localhost:3333
npm i
npm run dev
```
Frontend runs on `http://localhost:5173` by default.

2) Flow
- Open the app → Login page.
- If you have no account, create one via CLI: `node ace user:create`.
- Login → stores JWT and redirects to Dashboard.
- Dashboard fetches `/api/dashboard` with Bearer JWT; `Logout` clears token and returns to Login.

## Notes
- JWTs are signed with `JWT_SECRET` (fallback to `APP_KEY` if unset).
- CORS is enabled. For JWT, no cookies are used.
- Error handling returns appropriate HTTP status codes (400/401/409/500 as applicable).
