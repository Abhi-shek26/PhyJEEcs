import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ChapterwiseAttempt from "./ChapterwiseAttempt";
import DashboardCalendar from "./DashboardCalendar";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuthContext();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
          <p className="user-name"> Hii, {user.name}</p>
      </div>
 
          {/* <StreakCounter /> */}
          <DashboardCalendar />
          <ChapterwiseAttempt />
    </div>
  );
};

export default Dashboard;
