var ForeignKeyNameGenerator = require("../src/ForeignKeyNameGenerator.js");
var expect = require("chai").expect;

describe("ForeignKeyNameGenerator", function () {
    beforeEach(function () {
        ForeignKeyNameGenerator.init();
    });

    describe("generateForCollectionNamed(collectionName)", function () {
        it("supports prefix", function () {
            ForeignKeyNameGenerator.configure({prefix: "prefix_"});
            var collectionName = "people";
            expect(ForeignKeyNameGenerator.generateForCollectionNamed(collectionName))
                    .to.equal("prefix_people");
        });

        it("supports suffix", function () {
            ForeignKeyNameGenerator.configure({suffix: "_suffix"});
            var collectionName = "people";
            expect(ForeignKeyNameGenerator.generateForCollectionNamed(collectionName))
                    .to.equal("people_suffix");
        });

        it("supports singularization", function () {
            ForeignKeyNameGenerator.configure({singularize: true});
            var collectionName = "people";
            expect(ForeignKeyNameGenerator.generateForCollectionNamed(collectionName))
                    .to.equal("person");
        });

        it("doesn't change string when no configuration is provided", function () {
            var collectionName = "people";
            expect(ForeignKeyNameGenerator.generateForCollectionNamed(collectionName))
                    .to.equal("people");
        });
    });
});