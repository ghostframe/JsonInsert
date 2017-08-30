var singular = require("pluralize").singular;
var _ = require("lodash");

(function () {
    
    function generateForCollectionNamed(collectionName) {
        collectionName = singular(collectionName);
        return collectionName + "_id";
    }

    module.exports = {
        generateForCollectionNamed: generateForCollectionNamed
    };
})();