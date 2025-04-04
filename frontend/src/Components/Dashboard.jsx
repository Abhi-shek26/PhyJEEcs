import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import ChapterwiseAttempt from "./ChapterwiseAttempt";
import DashboardCalendar from "./DashboardCalendar";
import StreakCounter from "./StreakCounter";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const handleViewHistory = () => {
    navigate("/history");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
          <h2 className="user-name"> Hii, {user.name}</h2>
      </div>
 
          <StreakCounter />
          <DashboardCalendar />
          <ChapterwiseAttempt />
    </div>
  );
};

export default Dashboard;
