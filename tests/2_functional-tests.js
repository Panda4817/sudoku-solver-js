const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
	const puzzle =
		"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
	const answer =
		"135762984946381257728459613694517832812936745357824196473298561581673429269145378";
	suite("Tests for /api/solve route", () => {
		test("valid puzzle string", function (done) {
			chai
				.request(server)
				.post("/api/solve")
				.send({ puzzle: puzzle })
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "solution");
					assert.deepEqual(res.body, { solution: answer });
					done();
				});
		});
		test("missing puzzle string", function (done) {
			chai
				.request(server)
				.post("/api/solve")
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "error");
					assert.deepEqual(res.body, {
						error: "Required field missing",
					});
					done();
				});
		});
		test("invalid characters in puzzle string", function (done) {
			chai
				.request(server)
				.post("/api/solve")
				.send({
					puzzle:
						"1.5..2.84..63.12.7.2..5.....&..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "error");
					assert.deepEqual(res.body, {
						error: "Invalid characters in puzzle",
					});
					done();
				});
		});
		test("incorrect length puzzle string", function (done) {
			chai
				.request(server)
				.post("/api/solve")
				.send({
					puzzle:
						"1.5..2.84..63.12.7.2..5...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "error");
					assert.deepEqual(res.body, {
						error:
							"Expected puzzle to be 81 characters long",
					});
					done();
				});
		});
		test("puzzle string that cannot be solved", function (done) {
			chai
				.request(server)
				.post("/api/solve")
				.send({
					puzzle:
						"1.6..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "error");
					assert.deepEqual(res.body, {
						error: "Puzzle cannot be solved",
					});
					done();
				});
		});
	});

	suite("Tests for /api/check route", () => {
		test("all fields provided", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({
					puzzle: puzzle,
					coordinate: "A2",
					value: "3",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "valid");
					assert.property(res.body, "conflict");
					assert.deepEqual(res.body, {
						valid: true,
						conflict: [],
					});
					done();
				});
		});
		test("value already at the coordinate", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({
					puzzle: puzzle,
					coordinate: "A1",
					value: "1",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "valid");
					assert.property(res.body, "conflict");
					assert.deepEqual(res.body, {
						valid: true,
						conflict: [],
					});
					done();
				});
		});
		test("single placement conflict", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({
					puzzle: puzzle,
					coordinate: "A2",
					value: "8",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "valid");
					assert.property(res.body, "conflict");
					assert.deepEqual(res.body, {
						valid: false,
						conflict: ["row"],
					});
					done();
				});
		});
		test("multiple placement conflicts", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({
					puzzle: puzzle,
					coordinate: "A4",
					value: "5",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "valid");
					assert.property(res.body, "conflict");
					assert.deepEqual(res.body, {
						valid: false,
						conflict: ["row", "region"],
					});
					done();
				});
		});
		test("all placement conflicts", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({
					puzzle: puzzle,
					coordinate: "A2",
					value: "2",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "valid");
					assert.property(res.body, "conflict");
					assert.deepEqual(res.body, {
						valid: false,
						conflict: ["row", "column", "region"],
					});
					done();
				});
		});
		test("missing fields", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({ puzzle: puzzle, coordinate: "A2" })
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "error");
					assert.deepEqual(res.body, {
						error: "Required field(s) missing",
					});
					done();
				});
		});
		test("invalid characters in puzzle string", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({
					puzzle:
						"1.5..2.84..63.12.7.2..5.....&..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
					coordinate: "A2",
					value: "2",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "error");
					assert.deepEqual(res.body, {
						error: "Invalid characters in puzzle",
					});
					done();
				});
		});
		test("incorrect length puzzle string", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({
					puzzle:
						"1.5..2.84..63.12.7.2..5...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
					coordinate: "A2",
					value: "2",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "error");
					assert.deepEqual(res.body, {
						error:
							"Expected puzzle to be 81 characters long",
					});
					done();
				});
		});
		test("invalid coordinate", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({
					puzzle: puzzle,
					coordinate: "j",
					value: "3",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "error");
					assert.deepEqual(res.body, {
						error: "Invalid coordinate",
					});
					done();
				});
		});
		test("invalid value", function (done) {
			chai
				.request(server)
				.post("/api/check")
				.send({
					puzzle: puzzle,
					coordinate: "A2",
					value: "&",
				})
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body);
					assert.property(res.body, "error");
					assert.deepEqual(res.body, {
						error: "Invalid value",
					});
					done();
				});
		});
	});
});
