import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthorPage from "./pages/author/AuthorPage";
import BookPage from "./pages/book/BookPage";
import NotFound from "./pages/error/NotFound";
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
        <Route path={"/BookPage/:bookID"} element={<BookPage />} />
        <Route path={"/AuthorPage"} element={<AuthorPage />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </Router>
  );
};
export default App;
