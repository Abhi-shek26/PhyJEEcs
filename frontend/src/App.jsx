import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout";  // Import Layout
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Practice from "./Components/Practice";
import Profile from "./Components/Profile";
import Bookmarks from "./Components/Bookmarks";
import Dashboard from "./Components/Dashboard";
import Logout from "./Components/Logout";
import AddQuestion from "./Components/AddQuestion";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all routes inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="practice" element={<Practice />} />
          <Route path="profile" element={<Profile />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="logout" element={<Logout />} />
          <Route path="add" element={<AddQuestion />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
