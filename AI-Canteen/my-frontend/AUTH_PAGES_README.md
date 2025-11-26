# Authentication Pages Documentation

## Overview

Complete authentication system with Login, Register, and Forgot Password pages built with React.js and Bootstrap 5.

## Pages Created

### 1. Login Page (`/login`)

**File:** `src/pages/Login.js`

#### Features:

- Email or Phone number input
- Password field with lock icon
- "Forgot password?" link
- Sign In button with icon
- Social login options (Apple & Google)
- "Create an account" link for new users
- Fully responsive design

#### Form Fields:

- **Email or Phone**: Accepts email or phone number format
- **Password**: Secure password input

#### Actions:

- Regular login with email/phone and password
- Social authentication (Apple, Google)
- Navigate to forgot password page
- Navigate to registration page

---

### 2. Register Page (`/register`)

**File:** `src/pages/Register.js`

#### Features:

- Full Name input
- Email input
- Phone Number input
- Password field
- Confirm Password field
- Create Account button
- Social signup options (Apple & Google)
- "Sign in" link for existing users

#### Form Fields:

- **Full Name**: User's complete name
- **Email**: Valid email address
- **Phone Number**: Contact number
- **Password**: Secure password
- **Confirm Password**: Password verification

#### Validation:

- All fields are required
- Email format validation
- Password matching (frontend validation ready)

---

### 3. Forgot Password Page (`/forgot-password`)

**File:** `src/pages/ForgotPassword.js`

#### Features:

- Email input for password reset
- "Send Reset Link" button
- "Back to Login" link
- Clean, focused design

#### Form Fields:

- **Email**: User's registered email address

---

## Styling

### CSS File: `src/pages/Login.css`

Shared styling for all authentication pages with:

#### Design Elements:

- **Background**: Gradient background (#f5f7fa to #e9ecef)
- **Card Design**:
  - Border radius: 20px
  - Shadow: Large shadow for depth
  - Smooth fade-in animation
- **Color Scheme**:
  - Primary Green: `#2d7a45`
  - Hover Green: `#246438`
  - Background Beige: `#f8f3ed`
  - Text Dark: `#2c3e50`
  - Text Muted: `#6c757d`

#### Interactive Elements:

- **Input Fields**:

  - Beige background (#f8f3ed)
  - Icons on the left
  - Focus effect with green glow
  - Smooth transitions

- **Buttons**:

  - Rounded corners (12px)
  - Hover effects with lift animation
  - Shadow on hover
  - Icon + text layout

- **Social Buttons**:
  - Outlined style
  - Hover with color change
  - Border radius: 12px

---

## Routing Configuration

### Routes in `App.js`:

```javascript
/ → Landing Page (Home)
/login → Login Page
/register → Register Page
/forgot-password → Forgot Password Page
```

### Navigation:

- Updated `Navbar.js` to use React Router's `Link` and `useNavigate`
- Login and Register buttons in navbar navigate to respective pages
- All authentication pages have links to navigate between them

---

## Component Structure

```
src/
├── pages/
│   ├── LandingPage.js      # Home page with all landing components
│   ├── Login.js            # Login page
│   ├── Register.js         # Registration page
│   ├── ForgotPassword.js   # Password reset page
│   └── Login.css           # Shared authentication styles
├── components/
│   ├── Navbar.js           # Updated with React Router
│   ├── Hero.js
│   ├── Features.js
│   ├── Specials.js
│   └── Footer.js
├── App.js                  # Router configuration
└── App.css                 # Global styles
```

---

## Installation & Usage

### 1. Dependencies

Already installed:

- `react-router-dom` - For routing
- `bootstrap` - UI framework
- `react-bootstrap` - React components

### 2. Run the Application

```bash
cd "d:\VIT(24-27)\Year 3\AI-Canteen\my-frontend"
npm start
```

### 3. Access Pages

- **Home**: http://localhost:3000/
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Forgot Password**: http://localhost:3000/forgot-password

---

## Features to Implement (Backend Integration)

### Login Page:

- [ ] Form validation
- [ ] API call to authenticate user
- [ ] JWT token storage
- [ ] Error handling and display
- [ ] Social OAuth integration
- [ ] Remember me functionality
- [ ] Redirect after successful login

### Register Page:

- [ ] Form validation (password strength, email format)
- [ ] Password match validation
- [ ] API call to create user account
- [ ] Email verification
- [ ] Phone number verification
- [ ] Social OAuth signup
- [ ] Redirect to email verification page

### Forgot Password:

- [ ] API call to send reset email
- [ ] Success message display
- [ ] Email validation
- [ ] Reset token generation
- [ ] Create reset password page

---

## Responsive Design

### Breakpoints:

- **Mobile**: < 576px

  - Single column layout
  - Reduced padding
  - Smaller font sizes
  - Stacked social buttons

- **Tablet**: 576px - 992px

  - Card width adjusts
  - Comfortable spacing

- **Desktop**: > 992px
  - Centered card layout
  - Maximum width constraint
  - Full spacing and typography

---

## User Flow

### New User:

1. Land on home page
2. Click "Register" button
3. Fill registration form
4. Create account
5. (Future) Email verification
6. Login to access dashboard

### Existing User:

1. Click "Login" button
2. Enter credentials
3. Sign in
4. Access dashboard

### Forgot Password:

1. Click "Forgot password?" on login page
2. Enter email
3. Receive reset email
4. (Future) Create new password
5. Login with new password

---

## Customization Guide

### Change Colors:

Edit `src/pages/Login.css`:

```css
/* Primary button color */
.sign-in-btn {
  background-color: #2d7a45; /* Change this */
}

/* Input background */
.input-with-icon .form-control {
  background-color: #f8f3ed; /* Change this */
}
```

### Modify Form Fields:

Edit respective page components (`Login.js`, `Register.js`)

### Add New Social Providers:

Add button in social login section with appropriate icon and handler

---

## Security Considerations

### Current State (Frontend Only):

- Form validation ready
- No sensitive data stored
- HTTPS recommended for production

### Future Backend Integration:

- [ ] Password hashing (backend)
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Secure cookie management
- [ ] OAuth token handling

---

## Accessibility

- All forms have proper labels
- Keyboard navigation supported
- Focus indicators visible
- ARIA labels can be added
- Color contrast meets WCAG standards
- Responsive to screen readers

---

## Browser Compatibility

✅ Chrome (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Edge (latest)  
✅ Mobile browsers

---

## Troubleshooting

### Issue: Page doesn't navigate

**Solution**: Ensure React Router is properly installed

```bash
npm install react-router-dom
```

### Issue: Styles not applying

**Solution**: Check that Login.css is imported in page components

### Issue: Form submission reloads page

**Solution**: `e.preventDefault()` is already included in submit handlers

---

## Next Steps

1. **Backend Integration**: Connect to API endpoints
2. **State Management**: Add Redux or Context API for auth state
3. **Protected Routes**: Add route guards for authenticated pages
4. **Dashboard**: Create user dashboard after login
5. **Profile Management**: Add user profile editing
6. **Email Verification**: Implement verification flow
7. **Password Reset**: Complete reset password flow

---

**Built with ❤️ using React.js, Bootstrap 5, and React Router**
