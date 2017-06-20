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

    it('should link out multiple instances of embedded collections into new table', function () {
        var collection = [{
                id: 1,
                name: "George",
                heightInCm: 2.49,
                cars: [
                    {
                        model: "Mazda"
                    },
                    {
                        model: "Porsche",
                        year: 2000
                    }
                ]
            },
            {
                id: 2,
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
                            [2, "John", 10]]
                    },
                    {
                        name: "cars",
                        columns: ["model", "year", "people_id"],
                        rows: [
                            ["Mazda", undefined, 1],
                            ["Porsche", 2000, 1],
                            ["Fiat", undefined, 2],
                            ["Porsche", 2009, 2]
                        ]
                    }
                ]
                );
    });
    
    it('should link out embedded collections into new table, generating an id when it not defined', function () {
        var collection = [{
                id: 1,
                name: "George",
                heightInCm: 2.49,
                cars: [
                    {
                        model: "Mazda"
                    },
                    {
                        model: "Porsche",
                        year: 2000
                    }
                ]
            },
            {
                id: undefined,
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

        var idOfJohn = tables[0].rows[1].id;
        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["id", "name", "heightInCm"],
                        rows: [
                            [1, "George", 2.49],
                            [0, "John", 10]]
                    },
                    {
                        name: "cars",
                        columns: ["model", "year", "people_id"],
                        rows: [
                            ["Mazda", undefined, 1],
                            ["Porsche", 2000, 1],
                            ["Fiat", undefined, 0],
                            ["Porsche", 2009, 0]
                        ]
                    }
                ]
                );
    });
});