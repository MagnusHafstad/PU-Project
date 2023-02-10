import React from "react";
import BookList from "../../components/BookList";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <span className="heading">IBDB</span>
      <BookList />
    </div>
  );
}
