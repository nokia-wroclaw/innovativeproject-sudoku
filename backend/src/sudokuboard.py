from dataclasses import dataclass
from enum import Enum
from functools import singledispatchmethod
from random import shuffle, randint
from typing import Final, List, Set


@dataclass(frozen=True)
class Coord:
    x: int = 0
    y: int = 0


class Difficulty(Enum):
    TEST_SIMPLE = 81
    EASY = 32
    MEDIUM = 27
    HARD = 22
    DIABOLIC = 17


@dataclass
class SudokuCell:
    pos: Final[Coord]
    value: int = 0
    SIZE: Final[int] = 3

    def __post_init__(self):
        self.neighbors: Set[Coord] = set()
        for n in range(self.SIZE ** 2):
            self.neighbors.add(Coord(n, self.pos.y))
            self.neighbors.add(Coord(self.pos.x, n))

        block_coord = self._get_block_coord()

        for n in range(block_coord.x, block_coord.x + self.SIZE):
            for m in range(block_coord.y, block_coord.y + self.SIZE):
                self.neighbors.add(Coord(n, m))

        self.neighbors.remove(self.pos)

    def _get_block_coord(self) -> Coord:
        return Coord(
            (self.pos.x // self.SIZE) * self.SIZE,
            (self.pos.y // self.SIZE) * self.SIZE,
        )


class SudokuBoard:
    def __init__(self, SIZE=3, difficulty: Difficulty = Difficulty.MEDIUM):
        self.SIZE = SIZE
        self.VALID_VALUES = {x + 1 for x in range(SIZE ** 2)}
        self.cells = [
            SudokuCell(Coord(x, y), SIZE=SIZE)
            for x in range(SIZE ** 2)
            for y in range(SIZE ** 2)
        ]
        self.difficulty = difficulty
        self.fill_cells(0)

    def reset(self):
        for cell in self.cells:
            cell.value = 0

    def fill_cells(self, index: int) -> bool:
        cell: SudokuCell = self.cells[index]

        neighbor_values: Set[int] = {
            self.at(neighbor).value for neighbor in cell.neighbors
        }

        options: List[int] = list(self.VALID_VALUES.difference(neighbor_values))

        shuffle(options)

        for option in options:
            cell.value = option

            if index == len(self.cells) - 1 or self.fill_cells(index + 1):
                return True

        cell.value = 0
        return False

    def make_puzzle(self):
        clues = self.SIZE ** 4
        while clues >= self.difficulty.value:
            index = randint(0, self.SIZE ** 4 - 1)  # nosec
            while self.cells[index].value == 0:
                index = randint(0, self.SIZE ** 4 - 1)  # nosec
            self.cells[index].value = 0
            clues -= 1

    def solve_sudoku(self) -> bool:
        cell = next((c for c in self.cells if c.value == 0), None)
        if cell is None:
            return True
        neighbor_values: Set[int] = {
            self.at(neighbor).value for neighbor in cell.neighbors
        }
        options: List[int] = list(self.VALID_VALUES.difference(neighbor_values))
        for option in options:
            cell.value = option
            if self.solve_sudoku():
                return True
            cell.value = 0
        return False

    def resolve_index(self, index: int) -> Coord:
        return Coord(index // self.SIZE ** 2, index % self.SIZE ** 2)

    def resolve_position(self, position: Coord) -> int:
        return position.x * self.SIZE ** 2 + position.y

    @singledispatchmethod
    def at(self, cell_meta):
        raise NotImplementedError("I am able to get cell by position or index only.")

    @at.register
    def _(self, cell_meta: Coord) -> SudokuCell:
        return self.cells[self.resolve_position(cell_meta)]

    @at.register
    def _(self, cell_meta: int) -> SudokuCell:
        return self.cells[cell_meta]

    def get_board_matrix(self) -> List[List[int]]:
        return [
            [cell.value for cell in self.cells[x : x + self.SIZE ** 2]]
            for x in range(0, self.SIZE ** 2 ** 2, self.SIZE ** 2)
        ]


def check_sudoku(sudoku):
    n = len(sudoku)
    for row in sudoku:
        i = 1
        while i <= n:
            if i not in row:
                return False
            i += 1
    j = 0
    transpose = []
    temp_row = []
    while j < n:
        for row in sudoku:
            temp_row.append(row[j])
        transpose.append(temp_row)
        temp_row = []
        j += 1
    for row in transpose:
        i = 1
        while i <= n:
            if i not in row:
                return False
            i += 1
    return True
