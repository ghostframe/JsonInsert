var CollectionNormalizer = require("../src/CollectionNormalizer.js");
var CollectionToTableMapper = require("../src/CollectionToTableMapper.js");
var CollectionReader = require("../src/CollectionReader.js");
var InsertWriter = require("../src/InsertWriter.js");
var lodash = require("lodash");

(function () {

    function writeInsertFor(collectionSchemaString) {
        var collections = CollectionReader.readCollectionSchema(collectionSchemaString);
        collections = lodash.flatMap(collections, CollectionNormalizer.getNormalizedCollections);
        var tables = collections.map(CollectionToTableMapper.getTablesFromCollection);
        return writeInserts(tables);
    }
    
    function writeInserts(tables) {
        return tables.map(InsertWriter.writeTableInserts).join("\n\n");
    }
    
    module.exports = {
        writeInsertFor: writeInsertFor
    };

})();
