import React from "react";
import BookList from "../../components/BookList";
import SingleBook from "../../components/SingleBook";
import { Book } from "../../types";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <span className="heading">Gruppe 22</span>
      <BookList />
    </div>
  );
};
export default App;
