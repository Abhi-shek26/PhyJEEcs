import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import { useAuthContext } from "./hooks/useAuthContext";
import Layout from "./Components/Layout";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Practice from "./Components/Practice";
import Profile from "./Components/Profile";
import Bookmarks from "./Components/Bookmarks";
import Dashboard from "./Components/Dashboard";
import Logout from "./Components/Logout";
import AddQuestion from "./Components/AddQuestion";
import LandingPage from "./Components/LandingPage";
import AttemptHistory from "./Components/AttemptHistory";

function App() {
  const { user, loading } = useAuthContext();
  console.log("User in App:", user);

  if (loading) return <div className="loading-screen">
    <div className="loading-text">
    <h2>Authenticating...</h2>
    </div>
  </div>; // Wait for authentication check before rendering

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route
            index
            element={!user ? <LandingPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="signup"
            element={!user ? <Signup /> : <Navigate to="/dashboard" />}
          />

          {/* Protected Routes - Only accessible if user is logged in */}
          {user ? (
            <>
              <Route path="practice" element={<Practice />} />
              <Route path="/history" element={<AttemptHistory />} />
              <Route path="profile" element={<Profile />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="logout" element={<Logout />} />
              <Route path="add" element={<AddQuestion />} />
            </>
          ) : (
            // Redirect to login if user is not authenticated
            <>
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
