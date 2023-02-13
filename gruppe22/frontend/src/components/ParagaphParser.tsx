import React from "react";
import { Book } from "../types";

import * as ReactDOM from "react-dom";

//This is a great example og worst practise in typescript:
export function NewlineText(props: string) {
  const newText = props.split("\n").map((str: string) => <p>{str}</p>);

  return newText;
}
