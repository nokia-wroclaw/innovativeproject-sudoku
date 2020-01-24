import UIfx from "uifx";

const buttonSound = new UIfx("/sounds/button_click.mp3", {
  volume: 0.5
});

const wrongBoardSound = new UIfx("/sounds/incorrect_board.mp3", {
  volume: 0.5
});

const correctBoardSound = new UIfx("/sounds/correct_board.mp3", {
  volume: 0.5
});

export { buttonSound, wrongBoardSound, correctBoardSound };
