import React from "react";
import { useState } from "react";

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
    </form>
  );
}
