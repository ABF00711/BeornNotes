## BeornNotes — Developer Setup Guide

This repo contains a MERN app with a Node/Express backend and a React (Create React App) frontend.

### Prerequisites

- Node.js 18+ and npm 9+ (or Yarn)
- MongoDB (local or a hosted cluster)
- Git

### Project Structure

```
BeornNotes/
  backend/
    Controller/
    models/
    routes/
    .env               # backend environment variables (create this)
    package.json
  frontend/
    src/
    public/
    .env               # frontend environment variables (create this, optional)
    package.json
```

### 1) Clone and install

Open Windows PowerShell and run:

```powershell
git clone <your-repo-url> BeornNotes
cd BeornNotes

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ..\frontend
npm install
```

### 2) Configure environment variables

Create `backend/.env` with values that match your environment. Example:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/beornnotes
JWT_SECRET=replace_with_a_long_random_string
NODE_ENV=development
```

Optional: create `frontend/.env` for CRA runtime vars (they must start with `REACT_APP_`). Example:

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

After creating or changing `.env` files, restart the corresponding app.

### 3) Run the apps (two terminals)

Terminal A — backend:

```powershell
cd backend
npm start
```

Terminal B — frontend:

```powershell
cd frontend
npm start
```

By default, the frontend runs at `http://localhost:3000` and the backend at `http://localhost:5000`.

### Common scripts

- Frontend
  - `npm start` — start React dev server
  - `npm run build` — production build to `build/`

- Backend
  - `npm start` — start server (optionally via nodemon if configured)

### Troubleshooting

- If the frontend cannot reach the backend, verify `REACT_APP_API_BASE_URL` and backend `PORT`.
- Ensure MongoDB is running and `MONGO_URI` is correct.
- After changing `.env`, stop and restart the affected process.
- If port 3000/5000 is in use, set different ports in `.env` or accept the alternative when CRA prompts.

### Notes for contributors

- Follow existing code style and naming conventions.
- Use feature branches and open PRs for review.
- Keep secrets out of the repo; use `.env` files locally.
