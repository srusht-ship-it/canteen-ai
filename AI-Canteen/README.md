# 🍃 AI Canteen - Full Stack Application

A modern, intelligent canteen management system with AI-powered features, built with React and Node.js.

## 📁 Project Structure

```
AI-Canteen/
├── backend/                    # Node.js + Express + MongoDB API
├── my-frontend/                # React Frontend Application
├── start.ps1                   # Quick start script (Windows)
├── AUTHENTICATION_SETUP.md     # Complete authentication documentation
└── BACKEND_SETUP.md           # Backend setup instructions
```

## ✨ Features

### Current Features

- ✅ **User Authentication**: Complete login/registration system with JWT
- ✅ **Dietary Preferences**: Track user dietary needs (vegetarian, vegan, gluten-free, low-sugar)
- ✅ **Responsive Design**: Beautiful UI that works on all devices
- ✅ **Secure**: Password hashing, JWT tokens, protected routes
- ✅ **Modern UI**: Built with React Bootstrap

### Planned Features

- 🔜 Menu browsing and ordering
- 🔜 AI-powered meal recommendations
- 🔜 Order tracking
- 🔜 Payment integration
- 🔜 Admin dashboard
- 🔜 Analytics and reports

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Installation Guide](./BACKEND_SETUP.md)
3. **Git** (optional)

### Easy Start (Windows)

Simply run the PowerShell script:

```powershell
cd "d:\VIT(24-27)\Year 3\AI-Canteen"
.\start.ps1
```

This will:

- Check MongoDB status
- Start the backend server
- Start the frontend server
- Open both in separate terminal windows

### Manual Start

**Terminal 1 - Backend:**

```powershell
cd "d:\VIT(24-27)\Year 3\AI-Canteen\backend"
npm install
npm run dev
```

**Terminal 2 - Frontend:**

```powershell
cd "d:\VIT(24-27)\Year 3\AI-Canteen\my-frontend"
npm install
npm start
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🛠️ Technology Stack

### Frontend

- **React 18** - UI library
- **React Router v6** - Navigation
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📚 Documentation

- **[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)** - Complete authentication system documentation
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend installation and setup guide
- **[backend/README.md](./backend/README.md)** - API endpoints and usage

## 🎯 Usage

### Register a New Account

1. Open http://localhost:3000
2. Click "Register" in the navigation bar
3. Fill in your details:
   - Full Name
   - Email or Phone
   - Password (min 8 characters)
   - Confirm Password
   - Dietary Preferences (optional)
4. Click "Sign Up"

### Login

1. Click "Login" in the navigation bar
2. Enter your email/phone and password
3. Click "Sign In"
4. You'll be redirected to the home page

### API Testing

Use tools like Postman or cURL to test the API endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","emailOrPhone":"john@example.com","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"john@example.com","password":"password123"}'
```

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Protected API routes
- Input validation on both frontend and backend
- CORS enabled with proper configuration

## 🐛 Troubleshooting

### MongoDB Connection Failed

```
❌ MongoDB connection error
```

**Solution**: Make sure MongoDB is running

```powershell
net start MongoDB
```

### Port Already in Use

```
❌ Port 5000 is already in use
```

**Solution**: Change the port in `backend/.env` or stop the process using that port

### Frontend Won't Connect to Backend

```
❌ Network Error
```

**Solution**:

- Ensure backend is running on port 5000
- Check CORS settings in `backend/server.js`
- Verify API_URL in `my-frontend/src/services/api.js`

### Module Not Found Errors

```
❌ Cannot find module 'xyz'
```

**Solution**: Reinstall dependencies

```powershell
# In backend folder
npm install

# In frontend folder
npm install
```

## 📊 Database Schema

### User Model

```javascript
{
  fullName: String,
  emailOrPhone: String (unique),
  password: String (hashed),
  dietaryPreferences: Array,
  role: String (default: 'user'),
  isVerified: Boolean,
  createdAt: Date
}
```

## 🔄 Development Workflow

1. **Make Changes**: Edit files in `my-frontend/src` or `backend/`
2. **Auto Reload**: Both servers support hot reload
3. **Test**: Changes reflect automatically in browser
4. **Commit**: Use git to track changes

## 📦 Package Scripts

### Backend

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Frontend

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test"
}
```

## 🌟 Features in Detail

### Authentication System

- JWT-based token authentication
- Secure password storage with bcrypt
- Auto-login on successful registration
- Token stored in localStorage
- Protected routes on backend

### User Profile

- Full name management
- Email or phone login
- Dietary preferences tracking
- Profile updates

### UI/UX

- Modern, clean design
- Responsive layout
- Loading states
- Error handling
- Success notifications
- Form validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational purposes.

## 👥 Team

VIT Student Project - Year 3 (2024-27)

## 📞 Support

For issues:

1. Check the troubleshooting section
2. Review the documentation files
3. Check terminal/console for error messages
4. Verify all dependencies are installed

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)

---

**Last Updated**: October 2025
**Status**: ✅ Authentication System Completed

Happy Coding! 🚀
