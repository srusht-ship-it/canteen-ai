import React from 'react';
import NavigationBar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Specials from '../components/Specials';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="landing-page">
      <NavigationBar />
      <Hero />
      <Features />
      <Specials />
      <Footer />
    </div>
  );
}

export default LandingPage;
