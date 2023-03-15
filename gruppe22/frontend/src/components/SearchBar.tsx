import React from "react";
import { algoliaClient } from "../firebase-config";
import { InstantSearch, Hits, SearchBox } from "react-instantsearch-dom";
import BookHit from "./BookHit";
import "./Styles.css";

export default function SearchBar() {
  return (
    <div className="Search">
      <h1 className="searchTitle">Find your favorite books</h1>
      <InstantSearch indexName="ibdb" searchClient={algoliaClient}>
        <div className="right-panel">
          <SearchBox />
          <Hits hitComponent={BookHit} />
        </div>
      </InstantSearch>
    </div>
  );
}
