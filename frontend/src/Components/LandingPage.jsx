import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="hero">
      <h1>Welcome to phyJEEcs</h1>
      <p>Master Physics with curated practice for JEE preparation</p>
      <Link to="/login" className="cta-button">
        Get Started
      </Link>
    </div>
  );
};

export default LandingPage;
