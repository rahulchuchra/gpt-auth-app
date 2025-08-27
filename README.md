# Auth Portal — Email/Password + Google + GitHub

A simple auth demo with:
- Email/password **registration** + **login** (email format + strong password rule)
- **Google OAuth** and **GitHub OAuth** (creates/fetches user in Mongo, then issues JWT)
- JWT stored in `localStorage`, used for protected **/dashboard**
- Backend: **Node.js + Express + Mongoose + JWT + Passport**
- Frontend: **React (Vite) + React Router + Tailwind**

---

## Folder Structure (deliverable)
```
.
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── models/UserModel.js
│       ├── routes/authRoutes.js
│       ├── middleware/checkAuth.js
│       └── strategies.js
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        ├── apiClient.js
        ├── components/AuthGuard.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            └── Dashboard.jsx
```

> **Endpoints**
>
> - `POST /api/auth/register` → creates local user after validation
> - `POST /api/auth/login` → returns JWT on success
> - `GET  /api/auth/me` → protected; returns current user
> - `GET  /api/auth/google` → start Google OAuth
> - `GET  /api/auth/google/callback` → OAuth callback
> - `GET  /api/auth/github` → start GitHub OAuth
> - `GET  /api/auth/github/callback` → OAuth callback

---

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB (local or Docker, or Atlas)
- Google & GitHub accounts to create OAuth apps

---

## 1) Backend Setup

### 1.1 Install deps
```bash
cd backend
npm i
```

### 1.2 Environment variables
Create `backend/.env` (see `.env.example`):
```
PORT=4000
CLIENT_URL=http://localhost:5173

# Mongo (pick ONE)
# Local no-auth
MONGO_URL=mongodb://127.0.0.1:27017/authportal
# Docker with auth
# MONGO_URL=mongodb://root:pass123@127.0.0.1:27017/authportal?authSource=admin
# Atlas example
# MONGO_URL=mongodb+srv://<user>:<pass>@<cluster>/authportal?retryWrites=true&w=majority

# JWT
JWT_KEY=super_secret_change_me

# Google OAuth
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

> **Callback URLs to configure**
>
> - Google: `http://localhost:4000/api/auth/google/callback`
> - GitHub: `http://localhost:4000/api/auth/github/callback`

### 1.3 Run the server
```bash
npm run dev
```
You should see: `Mongo connected` and `Server on 4000`.

---

## 2) Frontend Setup (Vite + Tailwind v4)

### 2.1 Install deps
```bash
cd ../frontend
npm i
npm i -D @tailwindcss/vite
```

### 2.2 Vite config
**`vite.config.js`**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwind()],
  server: { port: 5173 }
})
```

### 2.3 Tailwind entry CSS
**`src/index.css`**
```css
@import "tailwindcss";
```
Import this file at the top of **`src/main.jsx`**:
```js
import './index.css'
```

### 2.4 Run the app
```bash
npm run dev
```
Open `http://localhost:5173`.

---

## 3) Password & Validation Rules
- Email must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Password must be **≥ 8 chars**, include **at least one number** and **one special** (`!@#$%^&*`)

---

## 4) Quick Test via cURL (optional)

### Register
```bash
curl -i -X POST http://localhost:4000/api/auth/register   -H 'Content-Type: application/json'   -d '{"email":"user1@example.com","password":"Hello123!","name":"User1"}'
```
Expect `201 Created`.

### Login
```bash
curl -i -X POST http://localhost:4000/api/auth/login   -H 'Content-Type: application/json'   -d '{"email":"user1@example.com","password":"Hello123!"}'
```
Expect `200 OK` with `{ token, user }`.

### Protected
```bash
curl -i http://localhost:4000/api/auth/me   -H 'Authorization: Bearer <PASTE_TOKEN>'
```

---

## 5) OAuth Setup (one time)

### Google
1. Google Cloud Console → **APIs & Services**
2. **OAuth consent screen** → External → add app name + test users
3. **Credentials** → **Create Credentials** → **OAuth client ID** → *Web application*
4. **Authorized redirect URI**: `http://localhost:4000/api/auth/google/callback`
5. Copy the **Client ID/Secret** into `.env` as `GOOGLE_ID`, `GOOGLE_SECRET`

### GitHub
1. GitHub → Settings → **Developer settings** → **OAuth Apps** → **New OAuth App**
2. Homepage URL: `http://localhost:5173`
3. Authorization callback URL: `http://localhost:4000/api/auth/github/callback`
4. Copy **Client ID/Secret** into `.env` as `GITHUB_ID`, `GITHUB_SECRET`

---

## 6) Demo Video Script (deliverable)
Record a short screen capture that shows:
1. **Email signup with validation error**
   - On `/register`, try a weak password → see inline error
   - Then register successfully → redirect to `/login`
2. **Email login**
   - On `/login`, sign in → land on `/dashboard` and see welcome message
3. **Social login(s)**
   - On `/login`, click **Continue with Google** (and/or GitHub)
   - Approve consent → returns to `/oauth-callback?token=...` → shows `/dashboard`
4. **Protected dashboard behavior**
   - In DevTools, remove `localStorage.token`
   - Reload `/dashboard` → redirected back to `/login`

> Any screen recorder works (QuickTime, OBS, Loom). Keep it ~1–2 minutes.

---

## 7) Troubleshooting

**OAuth2Strategy requires a clientID**
- `.env` names must match code: `GOOGLE_ID`, `GOOGLE_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`
- Ensure envs load before strategies: `import 'dotenv/config'` at the top of `src/server.js` and `src/strategies.js`

**MongoServerError: Command find requires authentication**
- If you started Mongo with auth (Docker), use:
  `MONGO_URL=mongodb://root:pass123@127.0.0.1:27017/authportal?authSource=admin`

**Invalid credentials on login**
- Register the email in the **current** DB, or login with the social provider if the account was created via OAuth (no `passwordHash`)

**Tailwind not loading**
- Using Tailwind v4: install `@tailwindcss/vite`, add to `vite.config.js`, create `src/index.css` with `@import "tailwindcss";`, import in `main.jsx`, restart dev server

---

## 8) Notes
- JWT is stored in `localStorage` and sent via `Authorization: Bearer <token>` (axios interceptor handles this)
- Route guard redirects unauthenticated users from `/dashboard` to `/login`
- Small `console.log`s are intentionally left for discussion

---

## 9) License
MIT (or omit for assignment)
# gpt-auth-app
