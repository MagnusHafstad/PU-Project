import React from "react";
import { useState } from "react";
import "./InsertBook.css";

export default function InsertBook() {
  return (
    <form>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" />
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input id="author" name="author" type="text" />
      </div>
      <div>
        <label htmlFor="photo">Photo</label>
        <input id="photo" name="filename" type="file" accept="image/png, image/gif, image/jpeg" />
      </div>
      {/* Might require newline */}
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" />
      </div>
      <button type="submit">Insert</button>
    </form>
  );
}
