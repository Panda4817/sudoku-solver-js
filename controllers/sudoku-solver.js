class SudokuSolver {
	validate(puzzleString) {
		if (puzzleString.length != 81) {
			return false;
		}
		for (let index = 0; index < 81; index++) {
			const char = puzzleString[index];
			if (char == ".") {
				continue;
			}
			const n = parseInt(char);
			if (isNaN(n)) {
				return false;
			} else if (n < 1 || n > 9) {
				return false;
			}
		}
		return true;
	}

	checkRowPlacement(puzzleString, row, column, value) {
		const rows = {
			A: 0,
			B: 1,
			C: 2,
			D: 3,
			E: 4,
			F: 5,
			G: 6,
			H: 7,
			I: 8,
		};
		if (rows.hasOwnProperty(row) == false) {
			return false;
		}
		if (column < 1 || column > 9) {
			return false;
		}
		row = rows[row];
		let r = 0;
		let row_string = "";
		for (
			let index = 0;
			index < puzzleString.length;
			index += 9
		) {
			if (r != row) {
				r++;
				continue;
			}
			row_string = puzzleString.substr(index, 9);
			break;
		}
		if (row_string[column - 1] != ".") {
			return false;
		}
		for (let index = 0; index < 9; index++) {
			const char = row_string[index];
			if (char == ".") {
				continue;
			}
			if (char == value) {
				return false;
			}
		}
		return true;
	}

	checkColPlacement(puzzleString, row, column, value) {}

	checkRegionPlacement(puzzleString, row, column, value) {}

	solve(puzzleString) {}
}

module.exports = SudokuSolver;
