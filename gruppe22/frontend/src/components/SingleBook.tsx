import React from "react";
import { Book } from "../types";
import "./Styles.css";

interface Props {
  b: Book;
}

export default function SingleBook({ b }: Props) {
  return (
    <div className="SingleBook">
      {b.title}, {b.author}
    </div>
  );
}
