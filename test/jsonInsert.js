var jsonInsert = require("../src/jsonInsert.js");
var chai = require('chai');
var expect = chai.expect;

describe('JsonInsert', function () {
    it('should support an array with one shallow object', function () {
        var collection = [{
                id: 1,
                name: "George",
                heightInCm: 2.49
            }];

        var tables = jsonInsert.getTables("people", collection);

        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["id", "name", "heightInCm"],
                        rows: [[1, "George", 2.49]]
                    }
                ]
                );
    });

    it('should complete objects with missing fields', function () {
        var collection = [{
                id: 1,
                name: "George",
                heightInCm: 2.49
            },
            {
                name: "John",
                heightInCm: 10
            }];

        var tables = jsonInsert.getTables("people", collection);

        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["id", "name", "heightInCm"],
                        rows: [
                            [1, "George", 2.49],
                            [undefined, "John", 10]]
                    }
                ]
                );
    });


    it('should link out one-time embedded collection as new table', function () {
        var collection = [{
                id: 1,
                name: "George",
                heightInCm: 2.49,
                cars: [
                    {
                        model: "Mazda",
                        year: 1998
                    },
                    {
                        model: "Porsche",
                        year: 2000
                    }
                ]
            },
            {
                name: "John",
                heightInCm: 10
            }];

        var tables = jsonInsert.getTables("people", collection);

        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["id", "name", "heightInCm"],
                        rows: [
                            [1, "George", 2.49],
                            [undefined, "John", 10]]
                    },
                    {
                        name: "cars",
                        columns: ["model", "year"],
                        rows: [
                            ["Mazda", 1998],
                            ["Porsche", 2000]
                        ]
                    }
                ]
                );
    });

    it('should link out similar embedded collections into new table', function () {
        var collection = [{
                id: 1,
                name: "George",
                heightInCm: 2.49,
                cars: [
                    {
                        model: "Mazda",
                    },
                    {
                        model: "Porsche",
                        year: 2000
                    }
                ]
            },
            {
                name: "John",
                heightInCm: 10,
                cars: [
                    {
                        model: "Fiat"
                    },
                    {
                        model: "Porsche",
                        year: 2009
                    }
                ]
            }];

        var tables = jsonInsert.getTables("people", collection);

        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["id", "name", "heightInCm"],
                        rows: [
                            [1, "George", 2.49],
                            [undefined, "John", 10]]
                    },
                    {
                        name: "cars",
                        columns: ["model", "year"],
                        rows: [
                            ["Mazda", undefined],
                            ["Porsche", 2000],
                            ["Fiat", undefined],
                            ["Porsche", 2009]
                        ]
                    }
                ]
                );
    });
});