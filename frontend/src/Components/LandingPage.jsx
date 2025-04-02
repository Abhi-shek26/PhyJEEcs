import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import "./LandingPage.css";


  const featuresData = [
    {
      title: "📖 Chapter-Wise Practice",
      description: "Access a structured collection of JEE Mains & Advanced questions for every chapter in the syllabus."
    },
    {
      title: "⚡ Different Question Types Covered",
      description: "From single correct and multiple correct to integer type and match-the-column – master different question formats."
    },
    {
      title: "📊 Performance Analysis",
      description: "Analyze your past attempts to uncover your strengths and areas for improvement."
    },
  ];

  const LandingPage = () => {
    const [activeFeature, setActiveFeature] = useState(null);
  
    const handleClick = (index) => {
      setActiveFeature(activeFeature === index ? null : index);
    };
  
  return (
  <div>
    <div className="hero">
      <h1>Welcome to phyJEEcs</h1>
      <p> Master Physics with curated practice for JEE preparation</p>
      <div className="features">
      {featuresData.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-item ${activeFeature === index ? "active" : ""}`} 
            >
              <div className="feature-title" onClick={() => handleClick(index)}>
                <h2>{feature.title }  </h2> <div className="icon">< IoIosArrowDropdownCircle /> </div>
              </div>
              <div 
                className="feature-description" 
                style={{ maxHeight: activeFeature === index ? "150px" : "0px", opacity: activeFeature === index ? "1" : "0" }}
              >
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      <Link to="/login" className="cta-button">
        Get Started
      </Link>
    </div>
    <div className="video-container">
      <h2>🎥 See PhyJEEcs in Action</h2>
      <video controls className="demo-video">
        <source src="/path-to-your-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  );
};

export default LandingPage;