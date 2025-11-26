# Canteen AI - Quick Navigation Guide

## 🚀 Available Pages

### 1. Landing Page (Home)

**URL:** `http://localhost:3000/`

- Hero section with "Fresh. Fast. Intelligent."
- AI features showcase
- Today's specials
- Full navigation

### 2. Login Page

**URL:** `http://localhost:3000/login`

- Email/Phone login
- Password field
- Social login (Apple, Google)
- Forgot password link
- Link to register

### 3. Register Page

**URL:** `http://localhost:3000/register`

- Full name, email, phone, password fields
- Confirm password
- Social signup options
- Link to login

### 4. Forgot Password

**URL:** `http://localhost:3000/forgot-password`

- Email input
- Send reset link
- Back to login

---

## 📁 Project Structure

```
my-frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Navbar.js          ✅ Updated with routing
│   │   ├── Hero.js
│   │   ├── Features.js
│   │   ├── Specials.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── LandingPage.js     ✅ NEW
│   │   ├── Login.js           ✅ NEW
│   │   ├── Login.css          ✅ NEW (shared styles)
│   │   ├── Register.js        ✅ NEW
│   │   └── ForgotPassword.js  ✅ NEW
│   ├── App.js                 ✅ Updated with Router
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── LANDING_PAGE_README.md
├── AUTH_PAGES_README.md       ✅ NEW
└── QUICK_GUIDE.md             ✅ This file
```

---

## 🎨 Design Features

### Color Palette

- **Primary Green:** `#2d7a45`
- **Success Green:** `#28a745`
- **Background Beige:** `#f8f3ed`
- **Background Gray:** `#f5f7fa`
- **Text Dark:** `#2c3e50`
- **Text Muted:** `#6c757d`

### UI Components

- Bootstrap 5 components
- Custom styled forms
- Animated buttons
- Card-based layouts
- Responsive design

---

## 🔗 Navigation Flow

```
Landing Page (/)
    │
    ├─→ Login (/login)
    │       ├─→ Forgot Password (/forgot-password)
    │       └─→ Register (/register)
    │
    └─→ Register (/register)
            └─→ Login (/login)
```

---

## 🛠️ Commands

### Start Development Server

```bash
cd "d:\VIT(24-27)\Year 3\AI-Canteen\my-frontend"
npm start
```

Server runs at: `http://localhost:3000`

### Install Dependencies

```bash
npm install
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

---

## ✨ Key Features Implemented

### Landing Page

✅ Responsive navbar with routing  
✅ Hero section with CTAs  
✅ AI features showcase  
✅ Today's specials menu  
✅ Footer with links

### Authentication Pages

✅ Login page with form  
✅ Register page with validation  
✅ Forgot password page  
✅ Social login buttons (UI ready)  
✅ Form icons and styling  
✅ Responsive design  
✅ Route navigation

---

## 📝 What's Next?

### Backend Integration Needed:

- [ ] API endpoints for auth
- [ ] User database
- [ ] JWT authentication
- [ ] Password hashing
- [ ] Email service
- [ ] OAuth setup

### Additional Pages to Create:

- [ ] Dashboard
- [ ] Menu page
- [ ] Cart page
- [ ] Order history
- [ ] User profile
- [ ] Admin panel

### Features to Add:

- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Success messages
- [ ] Protected routes
- [ ] User session management

---

## 🎯 Testing the Pages

1. **Start the server** (if not running):

   ```bash
   npm start
   ```

2. **Test Navigation**:

   - Click "Login" button in navbar
   - Click "Register" button in navbar
   - Use "Forgot password?" link
   - Use "Create an account" link
   - Use "Back to Login" link

3. **Test Forms**:

   - Fill out login form
   - Fill out registration form
   - Try forgot password form
   - Check validation (all fields required)

4. **Test Responsive**:
   - Resize browser window
   - Test on mobile device
   - Check tablet view

---

## 📱 Responsive Breakpoints

- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: > 768px
- **Large Desktop**: > 992px

---

## 🔍 Important Files to Know

### Core Files:

- `App.js` - Main router configuration
- `index.js` - React entry point

### Page Files:

- `pages/LandingPage.js` - Home page
- `pages/Login.js` - Login form
- `pages/Register.js` - Registration form
- `pages/ForgotPassword.js` - Password reset

### Component Files:

- `components/Navbar.js` - Navigation (has routing)
- `components/Hero.js` - Landing hero section
- `components/Features.js` - AI features cards
- `components/Specials.js` - Menu items
- `components/Footer.js` - Page footer

### Style Files:

- `App.css` - Global styles
- `pages/Login.css` - Auth pages styles
- `index.css` - Base styles

---

## 💡 Tips

1. **Hot Reload**: Changes auto-reload in development
2. **Console**: Check browser console for errors
3. **Network Tab**: Monitor API calls (future)
4. **React DevTools**: Install for debugging

---

## 📞 Support Files

- `LANDING_PAGE_README.md` - Landing page documentation
- `AUTH_PAGES_README.md` - Authentication pages documentation
- `QUICK_GUIDE.md` - This quick reference

---

**Happy Coding! 🚀**
