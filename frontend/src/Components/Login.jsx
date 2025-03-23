import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginSignup.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
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
