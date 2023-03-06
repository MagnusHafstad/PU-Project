import { Params, useNavigate, useParams } from "react-router-dom";
import { Book } from "../types";

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
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}
