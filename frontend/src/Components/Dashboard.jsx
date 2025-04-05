import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import ChapterwiseAttempt from "./ChapterwiseAttempt";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const handleViewHistory = () => {
    navigate("/history");
  };

  return (
    <div>
      <div className="user-details">
        <p>{user.name}</p>
        <p>{user.email}</p>
        <p>{user.year}</p>
        <button onClick={handleViewHistory}>View Attempt History</button>
      </div>
      <ChapterwiseAttempt/>
    </div>
  );
};

export default Dashboard;
