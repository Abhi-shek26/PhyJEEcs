import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from './animation.json';
import './LandingPage.css';

export default function LandingPage() {

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to PhyJEEcs</h1>
        <p>Master Physics with curated practice for JEE preparation</p>
        <Link to="/login" className="cta-button">Get Started</Link>
      </div>


      {/* Lottie Animation */}
      <div className="lottie-animation">
        <Lottie animationData={animationData} />
      </div>
    </div>
  );
};
