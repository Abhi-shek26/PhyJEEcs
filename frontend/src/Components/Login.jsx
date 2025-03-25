import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginSignup.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  try {
    const response = await fetch("http://localhost:4000/api/user/login", { 

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let data = {};
      if (response.headers.get("content-type")?.includes("application/json")) {
        data = await response.json();
      }
    if (!response.ok) {
      throw new Error(data.error);
    }
    console.log("Login successful", data);
  } catch (err) {
    setError(err.message); // Display error message
  }
};


  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>} {/* Show error message */}
        <form onSubmit={handleLogin}>
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
          <Link to="#" className="auth-link">
            Forgot password?
          </Link>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <div className="auth-footer">
          Not a member? <Link to="/signup">Signup now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
