var CollectionReader = require("../src/CollectionReader.js");
var expect = require('chai').expect;

describe("CollectionReader", function () {
    describe("readCollectionSchema()", function () {
        it("reads simple collection schema", function () {
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

            var collections =
                    [
                        {
                            name: "people",
                            documents: [
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
                        }
                    ];
            expect(CollectionReader.readCollectionSchema(simpleCollectionSchemaString))
                    .to.deep.equal(collections);
        });
    });
});