import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div>
      <div>
        <h1>Admin Page</h1>
      </div>

      <div>
        <Link to="/InsertBook">
          <button>Insert Book</button>
        </Link>
      </div>
    </div>
  );
}
