var ForeignKeyNameGenerator = require("../src/ForeignKeyNameGenerator.js");
var expect = require("chai").expect;

describe("ForeignKeyNameGenerator", function () {
    describe("generateForCollectionNamed(collectionName)", function () {
        it("supports prefix", function () {
            var collectionName = "people";
            var foreignKeyName = ForeignKeyNameGenerator.generateForCollectionNamed(collectionName, {prefix: "prefix_"});
            expect(foreignKeyName).to.equal("prefix_people");
        });
        it("supports suffix", function () {
            var collectionName = "people";
            var foreignKeyName = ForeignKeyNameGenerator.generateForCollectionNamed(collectionName, {suffix: "_suffix"});
            expect(foreignKeyName).to.equal("people_suffix");
        });
        it("supports singularization", function () {
            var collectionName = "people";
            var foreignKeyName = ForeignKeyNameGenerator.generateForCollectionNamed(collectionName, {singularize: true});
            expect(foreignKeyName).to.equal("person");
        });
        it("doesn't change string when no configuration is provided", function () {
            var collectionName = "people";
            var foreignKeyName = ForeignKeyNameGenerator.generateForCollectionNamed(collectionName);
            expect(foreignKeyName).to.equal("people");
        });
    });
});