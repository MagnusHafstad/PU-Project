import { signOut } from "firebase/auth";
import { useNavigate, Route } from "react-router-dom";
import { auth } from "../firebase-config";

export default function () {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
