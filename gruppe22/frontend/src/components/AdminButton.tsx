import { signOut } from "firebase/auth";
import { useNavigate, Route } from "react-router-dom";
import { auth } from "../firebase-config";

export default function AdminButton() {
  const navigate = useNavigate();
  const handleAdmin = () => {
    navigate("/Admin");
  };
  return (
    <div>
      <button onClick={handleAdmin}>Admin</button>
    </div>
  );
}
