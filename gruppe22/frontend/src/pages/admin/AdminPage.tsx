import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import "./AdminPage.css";

export default function AdminPage() {
  return (
    <div>
      <div>
        <h1>Admin Page</h1>
      </div>

      <div>
        <Link to="/InsertBook" className="InsertBookLink">
          <Button variant="contained">Insert Book</Button>
        </Link>
      </div>
    </div>
  );
}
