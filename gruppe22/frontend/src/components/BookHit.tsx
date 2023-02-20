import { Hit } from "react-instantsearch-core";
import { Book } from "../types";

interface HitProps {
  hit: Hit<Book>;
}

const BookHit: React.FunctionComponent<HitProps> = ({ hit }) => {
  return (
    <div>
      <h2>{hit.title}</h2>
      <p>{hit.author}</p>
      <p>{hit.description}</p>
    </div>
  );
};

export default BookHit;
