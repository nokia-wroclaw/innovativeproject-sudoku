import FieldModel from "./FieldModel";

export default class BoardModel {
  constructor(input) {
    let currentRow;
    this.rows = [];

    for (let row = 0; row < 9; row++) {
      currentRow = [];
      this.rows.push(currentRow);
      for (let col = 0; col < 9; col++) {
        currentRow.push(
          new FieldModel(
            this.rows.length - 1,
            currentRow.length,
            input[row][col]
          )
        );
      }
    }
  }

  columns() {
    if (!this.columns) {
      this.columns = [];
      for (let i = 0; i < 9; i++) {
        this.columns.push([]);
      }
      this.rows.forEach(row => {
        row.forEach((field, idx) => {
          this.columns[idx].push(field);
        }, this);
      }, this);
    }
    return this.columns;
  }
}
