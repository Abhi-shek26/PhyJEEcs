import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginSignup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup email:", email, "password:", password);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">
            Signup
          </button>
        </form>
        <div className="auth-footer">
          Already a member? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
