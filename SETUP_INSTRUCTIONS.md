# Setup Instructions for Team Members

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

## Step 1: Clone the Repository

```bash
git clone https://github.com/michaelhenr/echelonsociety.end.git
cd echelonsociety.end
```

## Step 2: Switch to the `akkad` Branch

```bash
git checkout akkad
```

## Step 3: Set Up Environment Variables

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit the `.env` file and add your MongoDB connection string:
```env
MONGO_URL=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
PORT=3400
```

**Important:** Ask the team lead for the MongoDB connection string. Do NOT commit the `.env` file to git!

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd ../frontend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit the `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3400
```

## Step 4: Install Dependencies

### Backend Dependencies
```bash
cd backend
npm install
```

### Frontend Dependencies
```bash
cd frontend
npm install
```

## Step 5: Run the Project

### Terminal 1 - Backend Server
```bash
cd backend
npm start
```

The backend server will run on `http://localhost:3400`

### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:8080` (or the port shown in the terminal)

## Step 6: Access the Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:3400

## Test Accounts

Ask the team lead for test account credentials (admin and client accounts).

## Troubleshooting

### MongoDB Connection Issues
- Make sure the MongoDB connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas (if using Atlas)
- Verify the database name in the connection string

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically use the next available port

### Dependencies Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Important Notes

- **Never commit `.env` files** - they contain sensitive information
- Always work on the `akkad` branch, not `main`
- Pull latest changes before starting work: `git pull origin akkad`

## Getting the MongoDB Connection String

Contact the team lead to get the MongoDB connection string. It should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

