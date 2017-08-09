var InsertWriter = require("../src/InsertWriter.js");
var expect = require('chai').expect;

describe("InsertWriter.writeTableInserts(tables)", function () {
    it("writes tables with one table and one row correctly", function () {
        var tables = [
            {
                name: "people",
                columns: ["id", "name", "height"],
                rows: [[1, "George", 2.49]]
            }
        ];

        expect(InsertWriter.writeTableInserts(tables)).to.equal(
                "INSERT INTO people (id, name, height) VALUES\n" +
                "(1, 'George', 2.49);");
    });

    it("separates rows with comma and newline", function () {
        var tables = [
            {
                name: "people",
                columns: ["id", "name", "height"],
                rows: [
                    [1, "George", 2.49],
                    [2, "John", 5.49]
                ]
            }
        ];

        expect(InsertWriter.writeTableInserts(tables)).to.equal(
                "INSERT INTO people (id, name, height) VALUES\n" +
                "(1, 'George', 2.49),\n" +
                "(2, 'John', 5.49);");
    });

    it("writes 'undefined' as 'NULL'", function () {
        var tables = [
            {
                name: "people",
                columns: ["id", "name", "height"],
                rows: [
                    [1, undefined, 2.49],
                    [2, "John", undefined]
                ]
            }
        ];

        expect(InsertWriter.writeTableInserts(tables)).to.equal(
                "INSERT INTO people (id, name, height) VALUES\n" +
                "(1, NULL, 2.49),\n" +
                "(2, 'John', NULL);");
    });

    it("separates table inserts with two newline characters", function () {
        var tables = [
            {
                name: "people",
                columns: ["id", "name", "height"],
                rows: [
                    [1, "George", 2.49],
                    [2, "John", 5.49]
                ]
            },
            {
                name: "cars",
                columns: ["id", "model", "person_id"],
                rows: [
                    [1, "Mazda", 1],
                    [2, "Fiat", 1]
                ]
            }
        ];

        expect(InsertWriter.writeTableInserts(tables)).to.equal(
                "INSERT INTO people (id, name, height) VALUES\n" +
                "(1, 'George', 2.49),\n" +
                "(2, 'John', 5.49);\n\n" +
                "INSERT INTO cars (id, model, person_id) VALUES\n" +
                "(1, 'Mazda', 1),\n" +
                "(2, 'Fiat', 1);");
    });
});