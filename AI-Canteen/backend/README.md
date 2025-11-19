# AI Canteen Backend

Backend API for the AI Canteen application with user authentication and management.

## Features

- User Registration with dietary preferences
- User Login with JWT authentication
- Password hashing with bcrypt
- Protected routes with JWT middleware
- MongoDB database integration
- Input validation
- CORS enabled

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env` file in the backend directory with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-canteen
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Start the server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register User

- **POST** `/api/auth/register`
- **Body:**

```json
{
  "fullName": "John Doe",
  "emailOrPhone": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "dietaryPreferences": ["vegetarian", "gluten-free"]
}
```

#### Login User

- **POST** `/api/auth/login`
- **Body:**

```json
{
  "emailOrPhone": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

#### Update Profile

- **PUT** `/api/auth/update-profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**

```json
{
  "fullName": "John Smith",
  "dietaryPreferences": ["vegan"]
}
```

## Database Schema

### User Model

```javascript
{
  fullName: String,
  emailOrPhone: String (unique),
  password: String (hashed),
  dietaryPreferences: [String],
  role: String (default: 'user'),
  isVerified: Boolean,
  createdAt: Date
}
```

## Project Structure

```
backend/
├── controllers/
│   └── authController.js
├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation
- Protected routes
- CORS configuration
- Environment variables for sensitive data

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Success Response Format

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "token": "jwt-token"
}
```
