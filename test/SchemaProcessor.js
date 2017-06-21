var SchemaProcessor = require("../src/SchemaProcessor.js");
var chai = require('chai');
var expect = chai.expect;

describe("InsertWriter", function () {
    describe("snakeCaseifyColumns()", function () {
        it("snake-cases all columns", function () {
            var schema = [
                {
                    columns: ["id", "name", "heightInMeters"]
                },
                {
                    columns: ["id", "model", "personId"]
                }
            ];

            SchemaProcessor.snakeCaseifyColumns(schema);
            expect(schema).to.deep.equal(
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