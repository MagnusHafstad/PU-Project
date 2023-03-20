import React from "react";
import BookList from "../../components/BookList";
import ChartList from "../../components/ChartList";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <BookList />
      <ChartList />
    </div>
  );
}
