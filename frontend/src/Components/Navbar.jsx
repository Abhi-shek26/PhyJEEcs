import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/">PhyJEEcs</NavLink>
      </div>

      {/* Desktop Navigation */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {isLoggedIn ? (
          <>
            <NavLink to="/dashboard" activeClassName="active">
              Dashboard
            </NavLink>
            <NavLink to="/practice" activeClassName="active">
              Practice
            </NavLink>
            <div
              className="profile-container"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="profile-icon">👤</div>
              {profileOpen && (
                <div className="profile-dropdown">
                  <NavLink to="/profile">Profile</NavLink>
                  <NavLink to="/bookmarks">Bookmarks</NavLink>
                  <NavLink to="/logout">Logout</NavLink>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login" activeClassName="active">
              Login
            </NavLink>
            <NavLink to="/signup" activeClassName="active">
              Signup
            </NavLink>
          </>
        )}
      </div>

      {/* Hamburger Button */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✖" : "☰"}
      </div>
    </nav>
  );
};

export default Navbar;
