import React, { useState } from "react";
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
                
                <div className="auth-tabs">
                    <button className="auth-tab active">Login</button>
                    <button className="auth-tab">Signup</button>
                </div>
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
                    <a href="#" className="auth-link">Forgot password?</a>
                    <button type="submit" className="auth-button">Login</button>
                </form>
                <div className="auth-footer">
                    Not a member? <a href="/signup">Signup now</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
