import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from '../hooks/useLogout';
import { NavLink, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import "./Navbar.css";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/">
          <img src="src/assets/phyJEEcs-logo.png" alt="phyJEEcs Logo" />
        </NavLink>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <NavLink to="/practice">Practice</NavLink>
            <NavLink to="/history">History</NavLink>

            <div
              className="profile-container"
              ref={profileRef} 
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="profile-icon">
                <CgProfile />
              </div>
              {profileOpen && (
                <div
                  className="profile-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <NavLink to="/profile">Profile</NavLink>
                  <NavLink to="/bookmarks">Bookmarks</NavLink>
                  <button className="logout-button" onClick={logout}>
                    Logout
                  </button>
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
