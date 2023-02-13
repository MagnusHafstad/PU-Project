import React from "react";
import BookDetails from "../../components/bookDetails";
import BookList from "../../components/BookList";
import SingleBook from "../../components/SingleBook";
import { Book } from "../../types";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <span className="heading">Gruppe 22</span>
      {/* <BookList /> */}
      <BookDetails />
    </div>
  );
};
export default App;
