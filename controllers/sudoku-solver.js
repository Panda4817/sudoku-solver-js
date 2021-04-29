class SudokuSolver {
	validate(puzzleString) {
		if (puzzleString.length != 81) {
			return [
				false,
				"Expected puzzle to be 81 characters long",
			];
		}
		for (let index = 0; index < 81; index++) {
			const char = puzzleString[index];
			if (char == ".") {
				continue;
			}
			const n = parseInt(char);
			if (isNaN(n)) {
				return [false, "Invalid characters in puzzle"];
			} else if (n < 1 || n > 9) {
				return [false, ""];
			}
		}
		return [true, ""];
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
		if (row_string[column - 1] != "." && row_string[column - 1] != value) {
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

	checkColPlacement(puzzleString, row, column, value) {
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
		let col_string = "";
		for (
			let index = column - 1;
			index < puzzleString.length;
			index += 9
		) {
			col_string += puzzleString[index];
		}
		if (col_string[row] != "." && col_string[row] != value) {
			return false;
		}
		for (let index = 0; index < 9; index++) {
			const char = col_string[index];
			if (char == ".") {
				continue;
			}
			if (char == value) {
				return false;
			}
		}
		return true;
	}

	checkRegionPlacement(puzzleString, row, column, value) {
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
		const regions = {};
		let region = null;
		let start_col = 0;
		let end_col = 3;
		let start_row = 0;
		let end_row = 3;
		let current_region = 1;
		while (true) {
			let string = "";
			for (let r = start_row; r < end_row; r++) {
				for (let c = start_col; c < end_col; c++) {
					if (r == row && c == column - 1) {
						region = current_region;
						if (puzzleString[r * 9 + c] != "." && puzzleString[r * 9 + c] != value) {
							return false;
						}
					}
					string += puzzleString[r * 9 + c];
				}
			}
			regions[current_region] = string;
			if (region != null) {
				break;
			}
			current_region++;
			if (current_region > 9) {
				break;
			}
			start_col += 3;
			end_col += 3;
			if (end_col > 9) {
				start_row += 3;
				end_row += 3;
				start_col = 0;
				end_col = 3;
			}
		}
		for (
			let index = 0;
			index < regions[region].length;
			index++
		) {
			if (value == regions[region][index]) {
				return false;
			}
		}
		return true;
	}

	solve(puzzleString) {
		const isValid = this.validate(puzzleString);
		if (isValid[0] == false) {
			if (isValid[1] != "") {
				return {error: isValid[1]};
			} else {
				return {error: "Puzzle cannot be solved"};
			}
		}
		const rows = {
			0: "A",
			1: "B",
			2: "C",
			3: "D",
			4: "E",
			5: "F",
			6: "G",
			7: "H",
			8: "I",
		};
		const possibles = {};
		while (true) {
			for (let r = 0; r < 9; r++) {
				for (let c = 0; c < 9; c++) {
					let numbers = [];
					if (puzzleString[r * 9 + c] == ".") {
						for (let n = 1; n < 10; n++) {
							const check1 = this.checkRowPlacement(
								puzzleString,
								rows[r],
								c + 1,
								n
							);
							if (!check1) {
								continue;
							}
							const check2 = this.checkColPlacement(
								puzzleString,
								rows[r],
								c + 1,
								n
							);
							if (!check2) {
								continue;
							}
							const check3 = this.checkRegionPlacement(
								puzzleString,
								rows[r],
								c + 1,
								n
							);
							if (!check3) {
								continue;
							}
							numbers.push(n);
						}
					} else {
						let num = parseInt(puzzleString[r * 9 + c]);
						puzzleString =
							puzzleString.slice(0, r * 9 + c) +
							"." +
							puzzleString.slice(r * 9 + c + 1);
						const check1 = this.checkRowPlacement(
							puzzleString,
							rows[r],
							c + 1,
							num
						);
						if (!check1) {
							return {error: "Puzzle cannot be solved"};
						}
						const check2 = this.checkColPlacement(
							puzzleString,
							rows[r],
							c + 1,
							num
						);
						if (!check2) {
							return {error: "Puzzle cannot be solved"};
						}
						const check3 = this.checkRegionPlacement(
							puzzleString,
							rows[r],
							c + 1,
							num
						);
						if (!check3) {
							return {error: "Puzzle cannot be solved"};
						}
						puzzleString =
							puzzleString.slice(0, r * 9 + c) +
							String(num) +
							puzzleString.slice(r * 9 + c + 1);
					}
					if (numbers.length == 1) {
						puzzleString =
							puzzleString.slice(0, r * 9 + c) +
							String(numbers[0]) +
							puzzleString.slice(r * 9 + c + 1);
						numbers = [];
					}
					possibles[r * 9 + c] = numbers;
				}
			}
			if (puzzleString.indexOf(".") == -1) {
				break;
			}
		}
		return {solution: puzzleString};
	}
}

module.exports = SudokuSolver;
