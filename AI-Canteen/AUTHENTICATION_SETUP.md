# AI Canteen - Full Stack Authentication Setup

## 📋 Overview

A complete full-stack authentication system for the AI Canteen application with:

- **Frontend**: React with Bootstrap UI
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT-based token authentication

---

## 🏗️ Architecture

```
AI-Canteen/
├── backend/                    # Backend API Server
│   ├── controllers/
│   │   └── authController.js   # Authentication logic
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   └── User.js             # User database schema
│   ├── routes/
│   │   └── auth.js             # API route definitions
│   ├── .env                    # Environment variables
│   ├── server.js               # Main server file
│   └── package.json
│
└── my-frontend/                # React Frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js        # Login page with API integration
    │   │   └── Register.js     # Registration page with API integration
    │   ├── services/
    │   │   └── api.js          # API service layer with axios
    │   └── App.js              # Main app with routing
    └── package.json
```

---

## 🎯 Features Implemented

### Backend Features

✅ User registration with validation
✅ User login with credentials verification
✅ Password hashing with bcrypt
✅ JWT token generation and verification
✅ Protected routes middleware
✅ Get user profile endpoint
✅ Update user profile endpoint
✅ Dietary preferences support
✅ Input validation with express-validator
✅ Error handling middleware
✅ CORS enabled

### Frontend Features

✅ Beautiful login page with form validation
✅ Registration page with dietary preferences
✅ API integration with axios
✅ Loading states during API calls
✅ Error and success alerts
✅ Token storage in localStorage
✅ Auto-redirect after successful auth
✅ Responsive design with Bootstrap

---

## 🔧 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcryptjs
- **Validation**: express-validator
- **Environment**: dotenv
- **CORS**: cors middleware

### Frontend

- **Library**: React 18
- **UI Framework**: React Bootstrap
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS + Bootstrap

---

## 🚀 API Endpoints

### Authentication Routes

| Method | Endpoint                   | Description         | Auth Required |
| ------ | -------------------------- | ------------------- | ------------- |
| POST   | `/api/auth/register`       | Register new user   | No            |
| POST   | `/api/auth/login`          | Login user          | No            |
| GET    | `/api/auth/me`             | Get current user    | Yes           |
| PUT    | `/api/auth/update-profile` | Update user profile | Yes           |

---

## 📦 Data Models

### User Schema

```javascript
{
  fullName: String (required),
  emailOrPhone: String (required, unique),
  password: String (required, hashed, min: 8),
  dietaryPreferences: [String],  // ['vegetarian', 'vegan', 'gluten-free', 'low-sugar']
  role: String (default: 'user'),
  isVerified: Boolean (default: false),
  createdAt: Date
}
```

---

## 🔐 Authentication Flow

### Registration Flow

1. User fills registration form
2. Frontend validates password match and length
3. Frontend sends POST to `/api/auth/register`
4. Backend validates input data
5. Backend checks if user already exists
6. Backend hashes password with bcrypt
7. Backend creates user in MongoDB
8. Backend generates JWT token
9. Frontend stores token in localStorage
10. User is redirected to home page

### Login Flow

1. User enters credentials
2. Frontend sends POST to `/api/auth/login`
3. Backend finds user by emailOrPhone
4. Backend compares password hash
5. Backend generates JWT token
6. Frontend stores token in localStorage
7. User is redirected to home page

### Protected Route Access

1. Frontend sends request with JWT in Authorization header
2. Backend middleware verifies JWT
3. Backend attaches user to request object
4. Protected route handler processes request

---

## 💾 Local Storage

The frontend stores:

- `token`: JWT authentication token
- `user`: User object with profile data

---

## 🎨 UI/UX Features

### Login Page

- Email/Phone input with icon
- Password input with icon
- Forgot password link
- Loading spinner during login
- Error/Success alerts
- Social login buttons (UI only)
- Link to registration page

### Registration Page

- Full name input
- Email/Phone input
- Password input with requirements
- Confirm password input
- Dietary preferences selection (multi-select)
- Password strength indicator
- Loading spinner during registration
- Error/Success alerts
- Link to login page

---

## 🔒 Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Protected Routes**: Middleware verification for sensitive endpoints
4. **Input Validation**: Server-side validation with express-validator
5. **CORS**: Configured to prevent unauthorized access
6. **Environment Variables**: Sensitive data stored in .env file
7. **Password Selection**: Passwords excluded from queries by default

---

## 📝 Environment Variables

Backend `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-canteen
JWT_SECRET=your-secret-key-change-this-in-production-123456789
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 🚦 How to Run

### 1. Start MongoDB

```powershell
net start MongoDB
```

### 2. Start Backend (Terminal 1)

```powershell
cd "d:\VIT(24-27)\Year 3\AI-Canteen\backend"
npm install
npm run dev
```

### 3. Start Frontend (Terminal 2)

```powershell
cd "d:\VIT(24-27)\Year 3\AI-Canteen\my-frontend"
npm install
npm start
```

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🧪 Testing the System

1. **Register a new account**:

   - Go to http://localhost:3000
   - Click "Register" button in navbar
   - Fill in the form with your details
   - Select dietary preferences
   - Click "Sign Up"
   - You should see success message and be redirected

2. **Login**:

   - Click "Login" button in navbar
   - Enter your credentials
   - Click "Sign In"
   - You should see success message and be redirected

3. **Verify Token Storage**:
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - You should see `token` and `user` stored

---

## 🔄 API Request/Response Examples

### Register Request

```json
POST /api/auth/register
{
  "fullName": "Jane Doe",
  "emailOrPhone": "jane@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "dietaryPreferences": ["vegetarian", "gluten-free"]
}
```

### Register Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f8a9b7c8d4e5f6g7h8i9j0",
    "fullName": "Jane Doe",
    "emailOrPhone": "jane@example.com",
    "dietaryPreferences": ["vegetarian", "gluten-free"],
    "role": "user"
  }
}
```

### Login Request

```json
POST /api/auth/login
{
  "emailOrPhone": "jane@example.com",
  "password": "securePassword123"
}
```

### Login Response

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f8a9b7c8d4e5f6g7h8i9j0",
    "fullName": "Jane Doe",
    "emailOrPhone": "jane@example.com",
    "dietaryPreferences": ["vegetarian", "gluten-free"],
    "role": "user"
  }
}
```

---

## 📚 Dependencies Installed

### Backend

- express: ^4.18.2
- mongoose: ^8.0.0
- bcryptjs: ^2.4.3
- jsonwebtoken: ^9.0.2
- dotenv: ^16.3.1
- cors: ^2.8.5
- express-validator: ^7.0.1
- nodemon: ^3.0.1 (dev)

### Frontend

- axios: Latest version (for API calls)
- react-router-dom: Already installed
- react-bootstrap: Already installed
- bootstrap: Already installed

---

## 🎯 Next Steps / Future Enhancements

1. **Email Verification**: Implement OTP-based email verification
2. **Password Reset**: Complete forgot password functionality
3. **Social Login**: Implement Google/Apple OAuth
4. **Refresh Tokens**: Add refresh token mechanism
5. **Role-Based Access**: Implement admin/user role permissions
6. **User Dashboard**: Create protected user dashboard
7. **Profile Management**: Add profile picture upload
8. **Session Management**: Add logout functionality across devices
9. **Rate Limiting**: Prevent brute force attacks
10. **Input Sanitization**: Add additional XSS protection

---

## 📞 Support

For issues or questions:

- Check the backend logs in the terminal
- Check browser console for frontend errors
- Verify MongoDB is running
- Ensure all environment variables are set correctly

---

**Created**: October 2025
**Version**: 1.0.0
**Status**: ✅ Fully Functional
