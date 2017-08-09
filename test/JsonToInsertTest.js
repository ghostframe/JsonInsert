var JsonToInsert = require("../src/JsonToInsert.js");
var expect = require('chai').expect;

describe("JsonToInsert", function () {
    describe("writeInsertFor()", function () {
        it("writes insert for simple collection schema", function () {
            var simpleCollectionSchemaString =
                    `{
                        people: [
                            {
                                id: 1,
                                name: "George",
                                height: 2.49
                            },
                            {
                                id: 2,
                                name: "John",
                                height: 1.49
                            }
                        ]
                    }`;
            var insertStatement =
                    "INSERT INTO people (height, id, name) VALUES\n" +
                    "(2.49, 1, 'George'),\n" +
                    "(1.49, 2, 'John');";
            expect(JsonToInsert.writeInsertFor(simpleCollectionSchemaString))
                    .to.equal(insertStatement);
        });
    });
});