import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from '../hooks/useLogout';
import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import "./Navbar.css";

const Navbar = () => {
  const { logout } = useLogout();
  
  const { user } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/">
          <img src="src/assets/phyJEEcs-logo.png" alt="phyJEEcs Logo" />
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/practice">Practice</NavLink>

            {/* Profile Dropdown */}
            <div
              className="profile-container"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="profile-icon">
                <CgProfile />
              </div>
              {profileOpen && (
                <div
                  className="profile-dropdown"
                  onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
                >
                  <NavLink to="/profile">Profile</NavLink>
                  <NavLink to="/bookmarks">Bookmarks</NavLink>
                  <NavLink onClick={logout}>Logout</NavLink>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Signup</NavLink>
          </>
        )}
      </div>

      {/* Hamburger Menu */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✖" : "☰"}
      </button>
    </nav>
  );
};

export default Navbar;
