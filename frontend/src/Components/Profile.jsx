import { useState } from "react";
import "./Profile.css";

const StudentProfile = () => {
  const [student, setStudent] = useState({
    name: "ABS",
    class: "11th Grade",
    email: "ak@gmail.com",
    password: "123456789"
  });

  const handleResetPassword = () => {
    alert("Reset Password functionality will be implemented here.");
  };


    return (
      <div className="container">
      <div className="profile-card">
        <div className="avatar-container">
          <div className="avatar">{student.name.charAt(0)}</div>
          <h2 className="name">{student.name}</h2>
        </div>
        <p className="info"><strong>Class:</strong> {student.class}</p>
        <p className="info"><strong>Email:</strong> {student.email}</p>
        <p className="info"><strong>Password:</strong> {student.password}</p>
        <button onClick={handleResetPassword} className="reset-button">Reset Password</button>
      </div>
    </div>
      
    );
  }
  
  
    export default StudentProfile;
  