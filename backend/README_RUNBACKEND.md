# Backend run instructions

1. Install dependencies
```powershell
cd backend
npm install
```
2. Copy `.env.example` to `.env` and edit SUPABASE_* variables

3. Run the server
```powershell
npm run start
```

The server will then be available on `http://localhost:4000`.

Note: This backend uses Supabase admin credentials; do not commit the `SUPABASE_SERVICE_ROLE_KEY`.
