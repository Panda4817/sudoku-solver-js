"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
	let solver = new SudokuSolver();

	//Index page (static HTML)
	app.route("/").get(function (req, res) {
		res.sendFile(process.cwd() + "/views/index.html");
	});

	app.route("/api/check").post((req, res) => {
		const puzzle = req.body.puzzle;
		const coordinate = req.body.coordinate;
		const value = req.body.value;
		if (!puzzle || !coordinate || !value) {
			res.json({ error: "Required field(s) missing" });
		}
		const number = parseInt(value);
		if (isNaN(number) || number < 1 || number > 9) {
			res.json({ error: "Invalid value" });
		}
		const rows = [
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"H",
			"I",
		];
		if (coordinate.length != 2) {
			res.json({ error: "Invalid coordinate" });
		}
		const r = coordinate[0].toUpperCase();
		const c = parseInt(coordinate[1]);
		if (rows.indexOf(r) < 0 || isNaN(c) || c < 1 || c > 9) {
			res.json({ error: "Invalid coordinate" });
		}
		const isValidPuzzle = solver.validate(puzzle);
		if (isValidPuzzle[0] == false) {
			res.json({ error: isValidPuzzle[1] });
		}
		const result = {
			valid: false,
			conflict: [],
		};
		const check1 = solver.checkRowPlacement(
			puzzle,
			r,
			c,
			number
		);
		if (!check1) {
			result.conflict.push("row");
		}
		const check2 = solver.checkColPlacement(
			puzzle,
			r,
			c,
			number
		);
		if (!check2) {
			result.conflict.push("column");
		}
		const check3 = solver.checkRegionPlacement(
			puzzle,
			r,
			c,
			number
		);
		if (!check3) {
			result.conflict.push("region");
		}
		if (result.conflict.length == 0) {
			result.valid = true;
		}
		res.json(result);
	});

	app.route("/api/solve").post((req, res) => {
		const puzzle = req.body.puzzle;
		if (!puzzle) {
			res.json({ error: "Required field missing" });
		}

		const result = solver.solve(puzzle);
		res.json(result);
	});
};
