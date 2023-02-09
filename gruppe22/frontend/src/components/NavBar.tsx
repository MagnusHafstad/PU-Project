import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import FindBooks from "../pages/findbooks/FindBooks";
import Home from "../pages/home/Home";

export default function () {
  return (
    <BrowserRouter>
      <div>
        <Link to="/">Home</Link>
        <Link to="/FindBooks">FindBooks</Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />}>
          <Home />
        </Route>
        <Route path="/FindBooks" element={<FindBooks />}>
          <FindBooks />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
