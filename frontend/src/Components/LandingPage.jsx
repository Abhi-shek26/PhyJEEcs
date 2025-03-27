import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from './animation.json';
import './LandingPage.css';

const LandingPage = () => {

  return (
    <div className="container-fluid">
      {/* Background Animation */}
      <div className="background">
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
      
        {/* Hero Section */}
        <div className="hero">
          <h1>Welcome to PhyJEEcs</h1>
          <p>Master Physics with curated practice for JEE preparation</p>
          <Link to="/login" className="cta-button">Get Started</Link>
          {/* Lottie Animation */}
        <div className="lottie-animation">
          <Lottie animationData={animationData} />
        </div>
        </div> 
    </div>
    </div>
  );
};

export default LandingPage;