import React from 'react';
import {render, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Init from "../components/Init/Init"

afterEach(cleanup);

it('renders', () => {
    const {asFragment} = render(<Init text="Sudoku Battle Royale"/>);
    expect(asFragment()).toMatchSnapshot();
});

it("inserts text in h1", () => {
    const {getByTestId} = render(<Init text="Sudoku Battle Royale"/>);
    expect(getByTestId('container')).toHaveClass('center');
    expect(getByTestId('text')).toHaveTextContent('Sudoku Battle Royale');
});