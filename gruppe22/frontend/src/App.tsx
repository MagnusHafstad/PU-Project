import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import BookList from "./components/BookList";
import FindBooks from "./pages/findbooks/FindBooks";
import Home from "./pages/home/Home";

const App: React.FC = () => {
  return (
    <Router>
      <nav className="navigationBar">
        <Link to="/" className="homeLink">
          Home
        </Link>
        <Link to="/FindBooks" className="findBooksLink">
          FindBooks
        </Link>
      </nav>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/FindBooks"} element={<FindBooks />} />
      </Routes>
    </Router>
  );
};
export default App;
