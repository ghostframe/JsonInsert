var _ = require("lodash");
var ForeignKeyNameGenerator = require("../src/ForeignKeyNameGenerator.js");

(function () {

    var collections;
    var currentId;
    
    function init() {
        collections = [];
        currentId = 0;
    }

    function getNormalizedCollections(collection) {
        init();
        collections.push(collection);
        normalize(collection);
        return collections;
    }

    function normalize(collection) {
        _.forEach(collection.documents, document =>
            _.forEach(embeddedCollectionsIn(document), embeddedCollection => {
                extract(embeddedCollection, collection.name, document);
                normalize(embeddedCollection);
            })
        );
    }

    function extract(embeddedCollection, parentCollectionName, document) {
        if (!document.id) {
            document.id = generateId();
        } else {
            currentId = document.id;
        }
        _.forEach(embeddedCollection.documents, embeddedDocument => {
            embeddedDocument[generateForeignKeyName(parentCollectionName)] = document.id;
        });
        pushCollection(embeddedCollection);
        delete document[embeddedCollection.name];
    }
    
    function generateForeignKeyName(parentCollectionName) {
        return ForeignKeyNameGenerator.generateForCollectionNamed(parentCollectionName);
    }

    function pushCollection(collection) {
        var existingCollection = collections.find(existingCollection => existingCollection.name === collection.name);
        if (existingCollection) {
            existingCollection.documents = existingCollection.documents.concat(collection.documents);
        } else {
            collections.push(collection);
        }
    }

    function generateId() {
        return ++currentId;
    }

    function embeddedCollectionsIn(object) {
        return Object.keys(object)
                .filter(field => (object[field] instanceof Array))
                .map(embeddedCollectionName => {
                    return {
                        name: embeddedCollectionName,
                        documents: object[embeddedCollectionName]
                    };
                });
    }

    module.exports = {
        getNormalizedCollections: getNormalizedCollections
    };

})();
