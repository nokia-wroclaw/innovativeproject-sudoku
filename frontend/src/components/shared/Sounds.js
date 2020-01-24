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

const stopwatchSound = new UIfx("/sounds/stopwatch.mp3", {
  volume: 0.5,
  throttleMs: 100
});

const swordsSound = new UIfx("/sounds/swords.mp3", {
  volume: 0.5,
  throttleMs: 100
});

const writeSound = new UIfx("/sounds/write.mp3", {
  volume: 0.4 // number between 0.0 ~ 1.0
});

const eraseSound = new UIfx("/sounds/erase.mp3", {
  volume: 0.4 // number between 0.0 ~ 1.0
});

export {
  buttonSound,
  wrongBoardSound,
  correctBoardSound,
  stopwatchSound,
  swordsSound,
  writeSound,
  eraseSound
};
