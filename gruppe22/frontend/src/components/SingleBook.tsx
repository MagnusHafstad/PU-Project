import React from "react";
import { Book } from "../types";
import "./Styles.css";

interface Props {
  book: Book;
}

export default function SingleBook({ book }: Props) {
  return (
    <div className="SingleBook">
      {book.title}, {book.author}
    </div>
  );
}
