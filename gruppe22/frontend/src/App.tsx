import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Signup from "./components/Signup";
import AuthorPage from "./pages/author/AuthorPage";
import BookPage from "./pages/book/BookPage";
import NotFound from "./pages/error/NotFound";
import FindBooks from "./pages/findbooks/FindBooks";
import Home from "./pages/home/Home";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <div className="space"></div>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/FindBooks"} element={<FindBooks />} />
        <Route path={"/BookPage/:bookID"} element={<BookPage />} />
        <Route path={"/AuthorPage"} element={<AuthorPage />} />
        <Route path={"*"} element={<NotFound />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path={"/Profile/:username"} element={<ProfilePage />} />
        {/* <Route path={"/LoginPage"} element={<LoginPage />} /> */}
      </Routes>
    </Router>
  );
};
export default App;
