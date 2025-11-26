# Canteen AI - Landing Page

## Overview

A modern, responsive landing page for an AI-powered canteen management system built with React.js and Bootstrap 5.

## Features

### 🎨 Design Components

- **Responsive Navigation Bar** - Login and Register buttons with mobile-friendly menu
- **Hero Section** - Eye-catching headline with call-to-action buttons
- **Features Section** - Showcase of AI capabilities:
  - AI Demand Forecasting
  - Quick Pickup
  - Personalized Recommendations
- **Today's Specials** - Dynamic menu items with pricing and add-to-cart functionality
- **Footer** - Social media links and site navigation

### 🛠️ Tech Stack

- **Framework:** React.js (v19.2.0)
- **UI Library:** Bootstrap 5.3.8 + React-Bootstrap 2.10.10
- **Styling:** Custom CSS with Bootstrap classes
- **Icons:** Emoji-based for a friendly, modern look

## Installation

1. Navigate to the frontend directory:

```bash
cd "d:\VIT(24-27)\Year 3\AI-Canteen\my-frontend"
```

2. Install dependencies (if not already installed):

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and visit: `http://localhost:3000`

## Project Structure

```
my-frontend/
├── public/
│   ├── index.html          # HTML template with updated meta tags
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Navbar.js       # Navigation bar component
│   │   ├── Hero.js         # Hero section with main CTA
│   │   ├── Features.js     # AI features showcase
│   │   ├── Specials.js     # Daily menu specials
│   │   └── Footer.js       # Footer with links
│   ├── App.js              # Main app component
│   ├── App.css             # Custom styling
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json
└── README.md
```

## Components Details

### Navbar

- Brand logo with "Canteen AI" branding
- Responsive navigation menu
- Login and Register buttons
- Mobile-friendly hamburger menu

### Hero Section

- Compelling headline: "Fresh. Fast. Intelligent."
- Descriptive tagline about AI-powered features
- Two CTAs: "Order Now" and "Explore Menu"
- Visual placeholder for food imagery

### Features

Three key features presented in card format:

1. **AI Demand Forecasting** - Reduces waste and wait times
2. **Quick Pickup** - Pre-order for perfect timing
3. **Personalized Recommendations** - Smart meal suggestions

### Today's Specials

Four featured menu items with:

- Item name and price
- Visual representation
- Brief description
- Add to cart button

### Footer

- Quick navigation links (About, Pricing, Contact, Privacy)
- Social media icons (Twitter, Instagram, LinkedIn)

## Customization

### Colors

Primary green theme can be modified in `App.css`:

- Primary: `#28a745`
- Success: `#218838`
- Dark: `#1e7e34`

### Content

Update component files in `src/components/` to modify:

- Menu items and prices
- Feature descriptions
- Navigation links
- Brand name and tagline

## Build for Production

To create an optimized production build:

```bash
npm run build
```

The build folder will contain the optimized files ready for deployment.

## Features to Add (Future Enhancements)

- [ ] Real menu API integration
- [ ] User authentication system
- [ ] Shopping cart functionality
- [ ] Order tracking
- [ ] Payment integration
- [ ] User profile and order history
- [ ] Real-time AI demand predictions display
- [ ] Nutritional information
- [ ] Dietary filters (vegan, gluten-free, etc.)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is part of the AI-Canteen management system.

---

**Built with ❤️ using React.js and Bootstrap 5**
