var ForeignKeyNameGenerator = require("../src/ForeignKeyNameGenerator.js");
var expect = require("chai").expect;

describe("ForeignKeyNameGenerator", function () {
    
    beforeEach(function () {
        ForeignKeyNameGenerator.init();
    });

    describe("generateForCollectionNamed(collectionName)", function () {
        it("supports prefix", function () {
            var collectionName = "people";
            ForeignKeyNameGenerator.configure({prefix: "prefix_"});
            var foreignKeyName = "prefix_people";
            expect(ForeignKeyNameGenerator.generateForCollectionNamed(collectionName))
                    .to.equal(foreignKeyName);
        });

        it("supports suffix", function () {
            var collectionName = "people";
            ForeignKeyNameGenerator.configure({suffix: "_suffix"});
            var foreignKeyName = "people_suffix";
            expect(ForeignKeyNameGenerator.generateForCollectionNamed(collectionName))
                    .to.equal(foreignKeyName);
        });

        it("supports singularization", function () {
            var collectionName = "people";
            ForeignKeyNameGenerator.configure({singularize: true});
            var foreignKeyName = "person";
            expect(ForeignKeyNameGenerator.generateForCollectionNamed(collectionName))
                    .to.equal(foreignKeyName);
        });

        it("doesn't change string when no configuration is provided", function () {
            var collectionName = "people";
            var foreignKeyName = "people";
            expect(ForeignKeyNameGenerator.generateForCollectionNamed(collectionName))
                    .to.equal(foreignKeyName);
        });
    });
});