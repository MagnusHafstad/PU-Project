import { signOut } from "firebase/auth";
import { useNavigate, Route } from "react-router-dom";
import { auth } from "../firebase-config";
import { Button } from "@mui/material";

export default function AdminButton() {
  const navigate = useNavigate();
  const handleAdmin = () => {
    navigate("/Admin");
  };
  return (
    <div>
      <Button onClick={handleAdmin} variant="contained">
        Admin
      </Button>
    </div>
  );
}
