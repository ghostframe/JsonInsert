var _ = require("lodash");

(function () {

    var collections = [];

    function normalize(collection) {
        collections.push(collection);
        _.forEach(collection.documents, document =>
            _.forEach(embeddedCollectionsIn(document), embeddedCollection => {
                extract(embeddedCollection, collection.name, document);
                normalize(embeddedCollection);
            })
        );
        return collections;
    }
    
    function extract(embeddedCollection, collectionName, document) {
        _.forEach(embeddedCollection.documents, embeddedDocument => {
            embeddedDocument["_" + collectionName + "_id"] = document.id;
        });
        delete document[embeddedCollection.name];
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
        normalize: normalize
    };

})();
