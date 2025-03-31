import React from 'react'
import { useNavigate } from 'react-router-dom'


const Dashboard = () => {  
  const navigate = useNavigate();

  const handleViewHistory = () => {
    navigate('/history');
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Dashboard page content goes here.</p>
      <button onClick={handleViewHistory}>View Attempt History</button>
    </div>
  )
}

export default Dashboard
