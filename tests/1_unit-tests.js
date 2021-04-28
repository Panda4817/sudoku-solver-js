const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const solver = new Solver();

suite("UnitTests", () => {
	suite("Tests for validate function", function () {
		test("valid puzzle input", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.equal(solver.validate(puzzle_input), true);
		});

		test("invalid characters in puzzle input", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....&..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.equal(solver.validate(puzzle_input), false);
		});

		test("invalid puzzle input length", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.equal(solver.validate(puzzle_input), false);
		});
	});

    suite("Tests for checkRowPlacement function", function () {
		test("valid row placement", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.equal(solver.checkRowPlacement(puzzle_input, "A", 2, 3), true);
		});

		test("invalid row placement", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.equal(solver.checkRowPlacement(puzzle_input, "A", 2, 2), false);
		});
	});


});
