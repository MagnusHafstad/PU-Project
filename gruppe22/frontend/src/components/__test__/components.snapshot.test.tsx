import * as React from "react";
import BookList from "../BookList";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer.create(<BookList />).toJSON();
  expect(tree).toMatchSnapshot();
});
