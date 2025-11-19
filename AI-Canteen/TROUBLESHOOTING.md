# Troubleshooting: "Cannot access 'authAPI' before initialization"

## ✅ FIXED!

This error has been resolved by refactoring the `src/services/api.js` file.

## What Was the Problem?

The error occurred due to how JavaScript handles object initialization in exports. When using object literal syntax with async functions directly in the export, there can be initialization timing issues.

## The Fix

Changed from:

```javascript
// OLD - Could cause initialization errors
export const authAPI = {
  register: async (userData) => { ... },
  login: async (credentials) => { ... }
};
```

To:

```javascript
// NEW - Functions defined first, then exported
const register = async (userData) => { ... };
const login = async (credentials) => { ... };

export const authAPI = {
  register,
  login,
  ...
};
```

## Verify the Fix

### 1. Check if both servers are running:

**Backend (Terminal 1):**

```powershell
cd "d:\VIT(24-27)\Year 3\AI-Canteen\backend"
npm run dev
```

✅ Should show: `✅ Connected to MongoDB` and `🚀 Server is running on port 5000`

**Frontend (Terminal 2):**

```powershell
cd "d:\VIT(24-27)\Year 3\AI-Canteen\my-frontend"
npm start
```

✅ Should open browser at `http://localhost:3000`

### 2. Test in Browser:

1. Open `http://localhost:3000`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Click "Login" or "Register" button
5. You should NOT see the initialization error anymore

### 3. Test Registration:

1. Click "Register" in the navbar
2. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Select some dietary preferences
3. Click "Sign Up"
4. Watch the Network tab in DevTools
5. You should see a POST request to `http://localhost:5000/api/auth/register`

### 4. Test Login:

1. Click "Login" in the navbar
2. Enter credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Sign In"
4. Watch the Network tab
5. You should see a POST request to `http://localhost:5000/api/auth/login`

## Common Issues After Fix

### Issue 1: Network Error

**Symptom:** "Network Error" or "ERR_CONNECTION_REFUSED"
**Solution:** Make sure backend is running on port 5000

```powershell
cd backend
npm run dev
```

### Issue 2: CORS Error

**Symptom:** "Access to XMLHttpRequest... has been blocked by CORS policy"
**Solution:** Backend already has CORS enabled. Make sure you're accessing frontend from `http://localhost:3000`

### Issue 3: MongoDB Connection Error

**Symptom:** Backend shows "MongoDB connection error"
**Solution:**

```powershell
# Start MongoDB service
net start MongoDB

# Or use MongoDB Atlas (cloud database)
# Update MONGODB_URI in backend/.env
```

### Issue 4: Module Not Found

**Symptom:** "Cannot find module 'axios'"
**Solution:**

```powershell
cd my-frontend
npm install axios
```

## How to Restart If Something Goes Wrong

1. **Stop both servers:**

   - Press `Ctrl+C` in both terminal windows

2. **Clear cache (if needed):**

   ```powershell
   # Frontend
   cd my-frontend
   Remove-Item -Recurse -Force node_modules/.cache

   # Or delete and reinstall
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

3. **Restart servers:**

   ```powershell
   # Terminal 1
   cd backend
   npm run dev

   # Terminal 2
   cd my-frontend
   npm start
   ```

## Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] MongoDB service is running
- [ ] No initialization errors in browser console
- [ ] Can navigate to Login page
- [ ] Can navigate to Register page
- [ ] Network tab shows API calls going to localhost:5000

## Still Having Issues?

If you still see the initialization error:

1. **Hard refresh the browser:** `Ctrl+Shift+R` or `Ctrl+F5`
2. **Clear browser cache:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Or open Incognito/Private window
3. **Check the exact error message in console**
4. **Verify api.js was saved with the new code:**
   ```powershell
   # Check the file
   Get-Content "d:\VIT(24-27)\Year 3\AI-Canteen\my-frontend\src\services\api.js" | Select-Object -First 30
   ```

## Success Indicators

When everything is working correctly, you should see:

### Browser Console (No Errors):

- No initialization errors
- No 404 errors
- No CORS errors

### Network Tab:

- POST requests to `/api/auth/login` or `/api/auth/register`
- Status: 200 or 201 (success) or 400/401 (validation/auth errors)
- Response includes `token` and `user` data

### Application Tab (Developer Tools):

After successful login/register:

- Local Storage → `token` (JWT token string)
- Local Storage → `user` (JSON object with user data)

## Test API Directly (Optional)

You can test the backend API directly using PowerShell:

```powershell
# Test Register
$body = @{
    fullName = "Test User"
    emailOrPhone = "test@example.com"
    password = "password123"
    confirmPassword = "password123"
    dietaryPreferences = @("vegetarian")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
```

```powershell
# Test Login
$body = @{
    emailOrPhone = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

---

**Status:** ✅ FIXED
**Last Updated:** October 2025
