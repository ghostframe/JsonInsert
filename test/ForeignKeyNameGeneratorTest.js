var ForeignKeyNameGenerator = require("../src/ForeignKeyNameGenerator.js");
var expect = require("chai").expect;

describe("ForeignKeyNameGenerator", function () {
    
    describe("generateForCollectionNamed(collectionName)", function () {
        it("singularizes and appends _id", function () {
            var collectionName = "people";
            var foreignKeyName = "person_id";
            expect(ForeignKeyNameGenerator.generateForCollectionNamed(collectionName))
                    .to.equal(foreignKeyName);
        });
    });
});