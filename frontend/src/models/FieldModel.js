export default class FieldModel {
  constructor(row, col, value = 0) {
    this.value = value;
    this.row = row;
    this.col = col;
    if (value === 0) {
      this.value = "";
      this.blocked = false;
    } else {
      this.value = parseInt(value, 10);
      this.blocked = true;
    }
  }
}
