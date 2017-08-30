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
        it("writes inserts for complex collection schema", function () {
            var simpleCollectionSchemaString =
                    `{
                        people: [
                            {
                                id: 1,
                                name: "George",
                                height: 2.49,
                                cars: [
                                    {
                                        id: 1,
                                        model: "Mazda",
                                        sponsors: [
                                            {brand: "MOMO"},
                                            {brand: "Yokohama"}
                                        ]
                                    },
                                    {
                                        model: "Porsche",
                                        year: 2000,
                                        sponsors: [
                                            {brand: "Toyo"}
                                        ]
                                    }
                                ]
                            },
                            {
                                id: 2,
                                name: "John",
                                height: 1.49,
                                cars: [
                                    {
                                        model: "Fiat",
                                        year: 2004
                                    },
                                    {
                                        model: "Volskwagen",
                                        year: 2001,
                                        sponsors: [
                                            {brand: "HHCL"}
                                        ]
                                    }
                                ]
                            },
                            {
                                id: 3,
                                name: "James",
                                height: 1.49,
                                cars: [
                                    {
                                        model: "BMW",
                                        year: 2007
                                    }
                                ]
                            }
                        ]
                    }`;
            var expectedInsertStatement =
                    "INSERT INTO people (height, id, name) VALUES\n" +
                    "(2.49, 1, 'George'),\n" +
                    "(1.49, 2, 'John'),\n" +
                    "(1.49, 3, 'James');\n" +
                    "\n" +
                    "INSERT INTO cars (id, model, person_id, year) VALUES\n" +
                    "(1, 'Mazda', 1, NULL),\n" +
                    "(2, 'Porsche', 1, 2000),\n" +
                    "(*, 'Fiat', 2, 2004),\n" + 
                    "(3, 'Volskwagen', 2, 2001),\n" +
                    "(*, 'BMW', 3, 2007);\n" +
                    "\n" +
                    "INSERT INTO sponsors (brand, car_id) VALUES\n" +
                    "('MOMO', 1),\n" +
                    "('Yokohama', 1),\n" +
                    "('Toyo', 2),\n" +
                    "('HHCL', 3);";
            var expectedInsertStatementParts = 
                    expectedInsertStatement.split("*");

            var actualInsertStatement = JsonToInsert.writeInsertFor(simpleCollectionSchemaString);
            console.log(actualInsertStatement);
            expectedInsertStatementParts.forEach(part => {
                expect(actualInsertStatement).to.have.string(part);
            });

        });
    });
});