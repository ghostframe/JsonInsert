var TableProcessor = require("../src/TableProcessor.js");
var expect = require('chai').expect;

describe("TableProcessor", function () {
    describe("snakeCaseifyColumns()", function () {
        it("snake-cases all columns", function () {
            var tables = [
                {
                    columns: ["id", "name", "heightInMeters"]
                },
                {
                    columns: ["id", "model", "personId"]
                }
            ];

            TableProcessor.snakeCaseifyColumns(tables);
            expect(tables).to.deep.equal(
                    [
                        {
                            columns: ["id", "name", "height_in_meters"]
                        },
                        {
                            columns: ["id", "model", "person_id"]
                        }
                    ]);
        });
    });
});