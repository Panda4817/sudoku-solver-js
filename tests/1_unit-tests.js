const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const solver = new Solver();

suite("UnitTests", () => {
	suite("Tests for validate function", function () {
		test("valid puzzle input", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.deepEqual(solver.validate(puzzle_input), [true, ""]);
		});

		test("invalid characters in puzzle input", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....&..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.deepEqual(solver.validate(puzzle_input), [false, "Invalid characters in puzzle"]);
		});

		test("invalid puzzle input length", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.deepEqual(solver.validate(puzzle_input), [false, "Expected puzzle to be 81 characters long"]);
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

    suite("Tests for checkColPlacement function", function () {
		test("valid col placement", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.equal(solver.checkColPlacement(puzzle_input, "A", 2, 3), true);
		});

		test("invalid col placement", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.equal(solver.checkColPlacement(puzzle_input, "A", 2, 2), false);
		});
	});

    suite("Tests for checkRegionPlacement function", function () {
		test("valid region placement", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.equal(solver.checkRegionPlacement(puzzle_input, "A", 2, 3), true);
		});

		test("invalid region placement", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.equal(solver.checkRegionPlacement(puzzle_input, "A", 2, 2), false);
		});
	});

    suite("Tests for solve function", function () {
		test("valid puzzle input solved", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            let answer = "135762984946381257728459613694517832812936745357824196473298561581673429269145378"
			assert.deepEqual(solver.solve(puzzle_input), {solution: answer});
		});

		test("invalid characters in puzzle input", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5.....&..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.deepEqual(solver.solve(puzzle_input), {error: "Invalid characters in puzzle"});
		});

		test("invalid puzzle input length", function () {
			let puzzle_input =
				"1.5..2.84..63.12.7.2..5...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.deepEqual(solver.solve(puzzle_input), {error: "Expected puzzle to be 81 characters long"});
		});

        test("invalid puzzle input - a number is wrong", function () {
			let puzzle_input =
				"1.6..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
			assert.deepEqual(solver.solve(puzzle_input), {error: "Puzzle cannot be solved"});
		});
	});


});
