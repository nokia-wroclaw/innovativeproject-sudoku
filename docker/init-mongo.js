use sudoku;

db.createUser(
    {
        user: "sudokuAdmin",
        pwd: "sudokuAdmin",
        roles: [
            {
                role: "readWrite",
                db: "sudoku"
            }
        ]
    }
);