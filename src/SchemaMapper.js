(function () {

    var schema;
    var usedIds = [];
    var MAX_GENERATED_ID = 1000000;

    function getNextAvailableId() {
        for (var i = 0; i < MAX_GENERATED_ID; i++) {
            if (usedIds.indexOf(i) === -1) {
                return i;
            }
        }
    }

    function getSchema(collectionName, documents) {
        schema = [];
        var collection = {
            name: collectionName,
            documents: documents
        };
        addForeignKeysToNestedCollectionsOfEachDocumentIn(collection);
        loadCollectionColumnsRecursive(collection);
        loadRows(collection);
        return schema;
    }

    function addForeignKeysToNestedCollectionsOfEachDocumentIn(collection) {
        collection.documents.forEach(
                document => {
                    var nestedCollectionsInDocument = nestedCollectionsIn(document);
                    if (thereAre(nestedCollectionsInDocument)) {
                        processOrSetId(document);
                        nestedCollectionsInDocument.forEach(nestedCollection => {
                            nestedCollection.documents.forEach(nestedDocument =>
                                setForeignKey(nestedDocument, collection.name, document.id)
                            );
                            addForeignKeysToNestedCollectionsOfEachDocumentIn(nestedCollection);
                        });
                    }
                }
        );
    }

    function setForeignKey(document, referencedCollection, referencedDocumentId) {
        document[generateForeignKeyIdFieldName(referencedCollection)] = referencedDocumentId;
    }

    function generateForeignKeyIdFieldName(nameOfCollectionToReferTo) {
        return nameOfCollectionToReferTo + "_id";
    }

    function loadRows(collection) {
        var table = getOrCreateTable(collection.name);
        collection.documents.forEach(document => {
            nestedCollectionsIn(document).forEach(loadRows);
            table.rows.push(
                    getRow(document, table.columns));
        });
    }

    function processOrSetId(document) {
        if (!document.id) {
            document.id = getNextAvailableId();
        }
        addIfMissing(usedIds, document.id);
    }

    function thereAre(array) {
        return array.length > 0;
    }

    function loadCollectionColumnsRecursive(collection) {
        var table = getOrCreateTable(collection.name);
        collection.documents.forEach(document => {
            getPrimitiveFields(document)
                    .forEach((field) => addIfMissing(table.columns, field));
            table.columns.sort();
            nestedCollectionsIn(document)
                    .forEach((nestedCollection) => {
                        loadCollectionColumnsRecursive(nestedCollection);
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

    function nestedCollectionsIn(object) {
        return Object.keys(object)
                .filter(field => !isPrimitive(object[field]))
                .map(nestedCollectionField => {
                    return {
                        name: nestedCollectionField,
                        documents: object[nestedCollectionField]
                    };
                });
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
        getSchema: getSchema
    };

})();
