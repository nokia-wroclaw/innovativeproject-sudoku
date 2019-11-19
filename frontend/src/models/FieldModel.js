export default class FieldModel {
  constructor(row, col, value = 0) {
    this.value = value;
    this.row = row;
    this.col = col;
    if (value === "#") {
      this.value = "";
    } else {
      this.value = parseInt(value, 10);
    }
  }
}
