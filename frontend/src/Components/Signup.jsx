import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginSignup.css";

const Signup = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); 

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try{
      const response = await fetch("http://localhost:4000/api/user/signup", { 

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, year }),
      });
      let data = {};
      if (response.headers.get("content-type")?.includes("application/json")) {
        data = await response.json();
      }
      if (!response.ok) {
        throw new Error(data.error);
      }
      console.log("Signup successful", data);
      setEmail("");
      setPassword("");
      setName("");
      setYear("");
      setConfirmPassword("");
      window.alert("Signup successful, please login to continue");
      navigate("/login");
    } catch (err) {
      setError(err.message); // Display error message
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Signup</h2>
        {error && <p className="error-message">{error}</p>} {/* Show error message */}
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
