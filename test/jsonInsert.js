var jsonInsert = require("../src/jsonInsert.js");
var chai = require('chai');
var expect = chai.expect;

describe('JsonInsert.getTables()', function () {
    it('should support a collection of one object with primitive fields', function () {
        var collection = [{
                id: 1,
                name: "George",
                height: 2.49
            }];

        var tables = jsonInsert.getTables("people", collection);

        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["height", "id", "name"],
                        rows: [[2.49, 1, "George"]]
                    }
                ]
                );
    });
    
    it('should convert field names to camel case column names', function () {
        var collection = [{
                id: 1,
                name: "George",
                heightInMeters: 2.49
            }];

        var tables = jsonInsert.getTables("people", collection);

        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["height_in_meters", "id", "name"],
                        rows: [[2.49, 1, "George"]]
                    }
                ]
                );
    });

    it('should complete objects with missing fields', function () {
        var collection = [{
                id: 1,
                name: "George",
                height: 2.49
            },
            {
                name: "John",
                height: 10
            }];

        var tables = jsonInsert.getTables("people", collection);

        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["height", "id", "name"],
                        rows: [
                            [2.49, 1, "George"],
                            [10, undefined, "John"]]
                    }
                ]
                );
    });

    it('should link out embedded collections into new table', function () {
        var collection = [{
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
            },
            {
                id: 2,
                name: "John",
                height: 10,
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
                        columns: ["height", "id", "name"],
                        rows: [
                            [2.49, 1, "George"],
                            [10, 2, "John"]]
                    },
                    {
                        name: "cars",
                        columns: ["model", "people_id", "year"],
                        rows: [
                            ["Mazda", 1, undefined],
                            ["Porsche", 1, 2000],
                            ["Fiat", 2, undefined],
                            ["Porsche", 2, 2009]
                        ]
                    }
                ]
                );
    });

    it('should link out embedded collections into new table, generating all ids when not defined', function () {
        var collection = [{
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
            },
            {
                name: "John",
                height: 10,
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
        var idOfGeorge = tables[0].rows[0][1];
        var idOfJohn = tables[0].rows[1][1];
        expect(idOfGeorge).to.not.be.undefined;
        expect(idOfJohn).to.not.be.undefined;
        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["height", "id", "name"],
                        rows: [
                            [2.49, idOfGeorge, "George"],
                            [10, idOfJohn, "John"]]
                    },
                    {
                        name: "cars",
                        columns: ["model", "people_id", "year"],
                        rows: [
                            ["Mazda", idOfGeorge, undefined],
                            ["Porsche", idOfGeorge, 2000],
                            ["Fiat", idOfJohn, undefined],
                            ["Porsche", idOfJohn, 2009]
                        ]
                    }
                ]
                );
    });

    it('should link out embedded collections into new table, generating an unique id when not defined but others are defined', function () {
        var collection = [{
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
            },
            {
                id: undefined,
                name: "John",
                height: 10,
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

        var idOfJohn = tables[0].rows[1][1];
        expect(idOfJohn).not.to.be.undefined; // Doesn't duplicate the ID
        expect(idOfJohn).not.to.equal(1); // Doesn't duplicate the ID
        expect(tables).to.deep.equal(
                [
                    {
                        name: "people",
                        columns: ["height", "id", "name"],
                        rows: [
                            [2.49, 1, "George"],
                            [10, idOfJohn, "John"]]
                    },
                    {
                        name: "cars",
                        columns: ["model", "people_id", "year"],
                        rows: [
                            ["Mazda", 1, undefined],
                            ["Porsche", 1, 2000],
                            ["Fiat", idOfJohn, undefined],
                            ["Porsche", idOfJohn, 2009]
                        ]
                    }
                ]
                );
    });

});