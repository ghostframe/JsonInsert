var jsonInsert = require("../src/jsonInsert.js");
var chai = require('chai');
var expect = chai.expect;

describe('JsonInsert.getTables()', function () {
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

    it('should link out embedded collections into new table', function () {
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

    it('should link out embedded collections into new table, generating all ids when not defined', function () {
        var collection = [{
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
        var idOfGeorge = tables[0].rows[0][2];
        var idOfJohn = tables[0].rows[1][2];
        expect(idOfGeorge).to.not.be.undefined;
        expect(idOfJohn).to.not.be.undefined;
        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["name", "heightInCm", "id"],
                        rows: [
                            ["George", 2.49, idOfGeorge],
                            ["John", 10, idOfJohn]]
                    },
                    {
                        name: "cars",
                        columns: ["model", "year", "people_id"],
                        rows: [
                            ["Mazda", undefined, idOfGeorge],
                            ["Porsche", 2000, idOfGeorge],
                            ["Fiat", undefined, idOfJohn],
                            ["Porsche", 2009, idOfJohn]
                        ]
                    }
                ]
                );
    });

    it('should link out embedded collections into new table, generating an unique id when not defined but others are defined', function () {
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

        var idOfJohn = tables[0].rows[1][0];
        expect(idOfJohn).not.to.be.undefined; // Doesn't duplicate the ID
        expect(idOfJohn).not.to.equal(1); // Doesn't duplicate the ID
        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["id", "name", "heightInCm"],
                        rows: [
                            [1, "George", 2.49],
                            [idOfJohn, "John", 10]]
                    },
                    {
                        name: "cars",
                        columns: ["model", "year", "people_id"],
                        rows: [
                            ["Mazda", undefined, 1],
                            ["Porsche", 2000, 1],
                            ["Fiat", undefined, idOfJohn],
                            ["Porsche", 2009, idOfJohn]
                        ]
                    }
                ]
                );
    });

});