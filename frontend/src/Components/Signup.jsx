import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import "./LoginSignup.css";

const Signup = () => {
  const { signup, isLoading, error } = useSignup();
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const data = await signup(name, email, password, confirmPassword, year);
    
    if (data) {
      console.log("Signup successful:", data);
    } else {
      console.error("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Signup</h2>
        {error && <p className="error-message">{error}</p>}
        
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
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="auth-input"
          />
          
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            className="auth-input"
          >
            <option value="">Select Class</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="Dropper">Dropper</option>
          </select>

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

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Signup"}
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
