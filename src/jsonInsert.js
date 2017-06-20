(function () {

    var schema;
    var usedIds = [];
    var MAX_POSSIBLE_ID = 1000000;

    function getNextAvailableId() {
        for (var i = 0; i < MAX_POSSIBLE_ID; i++) {
            if (usedIds.indexOf(i) === -1) {
                return i;
            }
        }
    }

    function getTables(collectionName, documents) {
        schema = [];
        loadObjectIntoSchemaAsTable(collectionName, documents);
        loadCollectionIntoTable(collectionName, documents);
        return schema;
    }

    function loadCollectionIntoTable(tableName, documents, parentDocumentName, parentDocumentId) {
        var table = getOrCreateTable(tableName);
        var thisIsAnEmbeddedDocument = (parentDocumentName !== undefined);
        if (thisIsAnEmbeddedDocument) {
            var foreignKeyToParentColumnName = parentDocumentName + "_id";
            addIfMissing(table.columns, foreignKeyToParentColumnName);
        }
        documents.forEach(document => {
            if (parentDocumentName) {
                document[foreignKeyToParentColumnName] = parentDocumentId;
            }
            var nestedCollections = getNestedCollections(document);
            if (thereAre(nestedCollections)) {
                generateIdIfMissing(document);
                nestedCollections
                        .forEach((nestedCollection) => {
                            loadCollectionIntoTable(nestedCollection, document[nestedCollection], tableName, document.id);
                        });
            }
            table.rows.push(
                    getRow(document, table.columns));
        });
    }

    function generateIdIfMissing(document) {
        if (!document.id) {
            document.id = getNextAvailableId();
        }
        addIfMissing(usedIds, document.id);
    }
    
    function thereAre(array) {
        return array.length > 0;
    }

    function loadObjectIntoSchemaAsTable(collectionName, documents) {
        var table = getOrCreateTable(collectionName);
        documents.forEach(document => {
            getPrimitiveFields(document)
                    .forEach((field) => addIfMissing(table.columns, field));
            var nestedCollections = getNestedCollections(document);
            if (nestedCollections.length > 0) {
                // There are nested collections, so you need the ID to link them back
                addIfMissing(table.columns, "id");
            }
            nestedCollections
                    .forEach((nestedCollection) => {
                        loadObjectIntoSchemaAsTable(nestedCollection, document[nestedCollection]);
                    });
        });
    }

    function getOrCreateTable(tableName) {
        var tableWithRequestedName =
                schema.find(table => table.name === tableName);
        if (tableWithRequestedName) {
            return tableWithRequestedName;
        } else {
            return createTable(tableName);
        }
    }

    function createTable(tableName) {
        var newTable = {
            name: tableName,
            columns: [],
            rows: []
        };
        schema.push(newTable);
        return newTable;
    }

    function getRow(object, columns) {
        return columns
                .map(column => object[column]);
    }

    function getNestedCollections(object) {
        return Object.keys(object)
                .filter(field => !isPrimitive(object[field]));
    }

    function getPrimitiveFields(object) {
        return Object.keys(object)
                .filter(field => isPrimitive(object[field]));
    }

    function isPrimitive(object) {
        return !(object instanceof Array);
    }

    function addIfMissing(array, value) {
        if (array.indexOf(value) === -1) {
            array.push(value);
        }
    }

    module.exports = {
        getTables: getTables
    };

})();
