import Field from "./FieldModel";

export default class BoardModel {
  constructor(input) {
    let currentRow;
    this.rows = [];

    for (let idx = 0; idx < input.length; idx++) {
      if (idx % 9 === 0) {
        currentRow = [];
        this.rows.push(currentRow);
      }
      currentRow.push(
        new Field(this.rows.length - 1, currentRow.length, input[idx])
      );
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
