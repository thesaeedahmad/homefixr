# Installation Guide — HomeFixr
*Iteration 14. Running the project locally.*

## Prerequisites
- **Node.js** 20+ and npm
- **Python** 3.11+ (for the AI service)
- A **Supabase** project (free) and a **Cloudinary** account (free)
- Git

## 1. Clone
```bash
git clone <your-repo-url> homefixr
cd homefixr
```

## 2. Configure the API
```bash
cd apps/api
cp .env.example .env
```
Edit `.env` and set:
- `DATABASE_URL` / `DIRECT_URL` from Supabase (percent-encode special characters
  in the password: `@` → `%40`, `/` → `%2F`),
- `JWT_SECRET` (any long random string),
- `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET`,
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`,
- `AI_SERVICE_URL=http://localhost:8000`.

Install, create the database tables, and seed the admin:
```bash
npm install
npm run migrate:deploy   # applies migrations to your Supabase DB
npm run seed             # creates the admin account
npm run dev              # API on http://localhost:4000
```

## 3. Run the AI service
```bash
cd ../ai
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000             # AI on http://localhost:8000
```

## 4. Run the web app
```bash
cd ../web
cp .env.example .env.local           # sets NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                          # web on http://localhost:3000
```

## 5. Verify
- API health: `http://localhost:4000/api/health`
- AI health: `http://localhost:8000/health`
- Open `http://localhost:3000`, register, and try the flows.

## Running the tests
```bash
cd apps/api
npm test          # unit tests (password + JWT utilities)
npm run typecheck # type safety
```

## Troubleshooting
- **`P1001` (can't reach database):** check the connection strings and that the
  password is percent-encoded; the direct connection uses port 5432.
- **AI hint never shows:** ensure the AI service is running and `AI_SERVICE_URL`
  is correct — the API degrades gracefully and simply hides the hint otherwise.
- **CORS errors:** set `WEB_ORIGIN` (API) to the exact web URL.
