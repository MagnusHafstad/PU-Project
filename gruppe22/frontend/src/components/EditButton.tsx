import { Params, useNavigate, useParams } from "react-router-dom";
import { Book } from "../types";
import { Button } from "@mui/material";

// interface Props {
//   book: Book;
// }

export default function EditButton() {
  const bookID = useParams().bookID;
  console.log(bookID);
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate("/Edit/" + bookID);
  };
  return (
    <div>
      <Button onClick={handleEdit} variant="contained">
        Edit
      </Button>
    </div>
  );
}
