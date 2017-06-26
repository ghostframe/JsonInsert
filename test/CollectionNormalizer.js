var CollectionNormalizer = require("../src/CollectionNormalizer.js");
var chai = require("chai");
var expect = chai.expect;

describe("CollectionNormalizer", function () {
    describe("normalize(collection)", function () {
        it("links out embedded collection into new table", function () {
            var collection = {
                name: "people",
                documents: [
                    {
                        id: 1,
                        name: "George",
                        height: 2.49,
                        cars: [
                            {
                                model: "Mazda"
                            },
                            {
                                model: "Porsche",
                                year: 2000
                            }
                        ]
                    }
                ]
            };

            var normalizedCollection = CollectionNormalizer.normalize(collection);

            expect(normalizedCollection).to.deep.equal(
                    [
                        {
                            name: "people",
                            documents: [
                                {
                                    id: 1,
                                    name: "George",
                                    height: 2.49
                                }
                            ]
                        },
                        {
                            name: "cars",
                            documents: [
                                {
                                    model: "Mazda",
                                    _people_id: 1
                                },
                                {
                                    model: "Porsche",
                                    year: 2000,
                                    _people_id: 1
                                }
                            ]
                        }
                    ]
                    );
        });
    });
});