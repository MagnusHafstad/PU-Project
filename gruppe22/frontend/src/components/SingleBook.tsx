import React from "react";
import { Link } from "react-router-dom";
import { Book } from "../types";
import "./Styles.css";

interface Props {
  book: Book;
}

export default function SingleBook({ book }: Props) {
  const bookLink: string = "/BookPage/" + book.id;
  return (
    <div className="SingleBook">
      <Link to={bookLink} className="LinkToBook">
        {book.title}
      </Link>
      <span>,&nbsp;</span>
      <Link to={"/AuthorPage"} className="LinkToAuthor">
        {book.author}
      </Link>
    </div>
  );
}
