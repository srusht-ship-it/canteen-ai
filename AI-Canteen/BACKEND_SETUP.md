# Backend Setup Guide

## Prerequisites

Before running the backend, you need to install MongoDB on your system.

### Installing MongoDB on Windows

1. **Download MongoDB Community Server**

   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows and download the MSI installer
   - Run the installer and follow the installation wizard
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)

2. **Verify MongoDB Installation**
   ```powershell
   mongod --version
   ```

### Alternative: Using MongoDB Atlas (Cloud Database)

If you don't want to install MongoDB locally, you can use MongoDB Atlas (free tier available):

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Get your connection string
5. Update `.env` file with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai-canteen?retryWrites=true&w=majority
   ```

## Running the Backend

1. **Make sure you're in the backend directory:**

   ```powershell
   cd "d:\VIT(24-27)\Year 3\AI-Canteen\backend"
   ```

2. **Install dependencies (if not already done):**

   ```powershell
   npm install
   ```

3. **Start MongoDB service (if using local installation):**

   ```powershell
   net start MongoDB
   ```

4. **Start the backend server:**

   ```powershell
   # Development mode (with auto-reload)
   npm run dev

   # Or production mode
   npm start
   ```

5. **You should see:**
   ```
   ✅ Connected to MongoDB
   🚀 Server is running on port 5000
   ```

## Testing the API

You can test the endpoints using:

- Postman
- Thunder Client (VS Code extension)
- cURL commands
- Or by running the frontend application

### Example cURL commands:

**Register a new user:**

```powershell
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{\"fullName\":\"John Doe\",\"emailOrPhone\":\"john@example.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\",\"dietaryPreferences\":[\"vegetarian\"]}'
```

**Login:**

```powershell
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{\"emailOrPhone\":\"john@example.com\",\"password\":\"password123\"}'
```

## Running Frontend and Backend Together

1. **Terminal 1 - Backend:**

   ```powershell
   cd "d:\VIT(24-27)\Year 3\AI-Canteen\backend"
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```powershell
   cd "d:\VIT(24-27)\Year 3\AI-Canteen\my-frontend"
   npm start
   ```

The frontend will run on `http://localhost:3000` and connect to the backend at `http://localhost:5000`.

## Troubleshooting

### MongoDB Connection Issues

- Make sure MongoDB service is running: `net start MongoDB`
- Check if port 27017 is available
- Verify MONGODB_URI in .env file

### Port Already in Use

- Backend uses port 5000, Frontend uses port 3000
- If port is in use, either:
  - Stop the process using that port
  - Change PORT in .env file

### CORS Issues

- Backend has CORS enabled by default
- If you change frontend port, you may need to update CORS settings

## Environment Variables

Make sure your `.env` file in the backend directory contains:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-canteen
JWT_SECRET=your-secret-key-change-this-in-production-123456789
JWT_EXPIRE=7d
NODE_ENV=development
```

## Next Steps

Once both servers are running:

1. Open http://localhost:3000 in your browser
2. Try registering a new account
3. Login with your credentials
4. The authentication token will be stored in localStorage
