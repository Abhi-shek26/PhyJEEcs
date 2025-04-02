import { Link } from "react-router-dom";
import "./LandingPage.css";

const featuresData = [
  {
    title: "📖 Chapter-Wise Practice",
    description:
      "Access a structured collection of JEE Mains & Advanced questions for every chapter in the syllabus.",
  },
  {
    title: "⚡ Different Question Types Covered",
    description:
      "From single correct and multiple correct to integer type and match-the-column – master different question formats.",
  },
  {
    title: "📊 Performance Analysis",
    description:
      "Analyze your past attempts to uncover your strengths and areas for improvement.",
  },
];

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="hero">
        <h1>Welcome to phyJEEcs</h1>
        <p> Master Physics with curated practice for JEE preparation</p>
        <div className="features">
          {featuresData.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-title">
                <h2>{feature.title} </h2>{" "}
              </div>
              <div className="feature-description">
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
