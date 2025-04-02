import { useAuthContext } from "../hooks/useAuthContext";
import "./Profile.css";

const StudentProfile = () => {
  const { user } = useAuthContext();
  console.log(user);

  const handleResetPassword = () => {
    alert("Reset Password functionality will be implemented here.");
  };

  return (
    <div className="container">
      <div className="profile-card">
        <div className="avatar-container">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h2 className="name">{user.name}</h2>
        </div>
        <p className="info">
          <strong>Class:</strong> {user.year}
        </p>
        <p className="info">
          <strong>Email:</strong> {user.email}
        </p>
        <button onClick={handleResetPassword} className="reset-button">
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
