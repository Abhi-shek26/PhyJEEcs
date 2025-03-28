import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Layout from "./Components/Layout";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Practice from "./Components/Practice";
import Profile from "./Components/Profile";
import Bookmarks from "./Components/Bookmarks";
import Dashboard from "./Components/Dashboard";
import Logout from "./Components/Logout";
import AddQuestion from "./Components/AddQuestion";
import LandingPage from "./Components/LandingPage";
import Question from "./Components/Question";

function App() {
  const { user,loading } = useAuthContext();
  console.log("User in App:", user);

  if (loading) return <p style={{ textAlign: "center" }}>Authenticating...</p>; // Wait for authentication check before rendering

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route
            index
            element={!user ? <LandingPage /> : <Navigate to="/home" />}
          />
          <Route
            path="login"
            element={!user ? <Login /> : <Navigate to="/home" />}
          />
          <Route
            path="signup"
            element={!user ? <Signup /> : <Navigate to="/home" />}
          />

          {/* Protected Routes - Only accessible if user is logged in */}
          {user ? (
            <>
              <Route path="home" element={<Home />} />
              <Route path="practice" element={<Practice />} />
              <Route path="profile" element={<Profile />} />
              <Route path="bookmarks" element={<Bookmarks />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="question" element={<Question />} />
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
