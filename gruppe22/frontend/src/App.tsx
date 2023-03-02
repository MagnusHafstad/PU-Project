import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthorPage from "./pages/author/AuthorPage";
import BookPage from "./pages/book/BookPage";
import NotFound from "./pages/error/NotFound";
import FindBooks from "./pages/findbooks/FindBooks";
import Home from "./pages/home/Home";
import InsertBook from "./pages/insertbook/InsertBook";

const App: React.FC = () => {
  return (
    <Router>
      <nav className="navigationBar">
        <div>
          <Link to="/" className="homeLink">
            <span className="heading">IBDB</span>
          </Link>
          <Link to="/FindBooks" className="findBooksLink">
            FindBooks
          </Link>
          <Link to="/InsertBook" className="insertBookLink">
            InsertBook
          </Link>
        </div>
      </nav>
      <div className="space"></div>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/FindBooks"} element={<FindBooks />} />
        <Route path={"/BookPage/:bookID"} element={<BookPage />} />
        <Route path={"/AuthorPage"} element={<AuthorPage />} />
        <Route path={"/InsertBook"} element={<InsertBook />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </Router>
  );
};
export default App;
