import React from "react";
import { render } from "@testing-library/react";
import Init from "../components/Init/Init";

it("renders", () => {
  const { asFragment } = render(<Init text="Sudoku Battle Royale" />);
  expect(asFragment()).toMatchSnapshot();
});

it("inserts text in h1", () => {
  const { queryByTestId } = render(<Init text="Sudoku Battle Royale" />);
  expect(queryByTestId("text")).toHaveTextContent("Sudoku Battle Royale");
});
