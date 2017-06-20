(function () {

    var schema;
    var usedIds = [];
    var MAX_POSSIBLE_ID = 1000000;
    
    function getNextAvailableId() {
        for(var i = 0; i < MAX_POSSIBLE_ID; i++) {
            if (usedIds.indexOf(i) === -1) {
                return i;
            }
        }
    }

    function getTables(collectionName, documents) {
        schema = [];
        loadObjectIntoSchemaAsTable(collectionName, documents);
        loadObjectIntoTable(collectionName, documents);
        return schema;
    }

    function loadObjectIntoTable(tableName, documents, parentObjectName, parentObjectId) {
        var table = getOrCreateTable(tableName);
        if (parentObjectName) {
            var foreignKeyColumnName = parentObjectName + "_id";
            addToSet(table.columns, foreignKeyColumnName);
            setFieldToAllDocuments(documents, foreignKeyColumnName, parentObjectId);
        }
        documents.forEach(document => {
            var nestedCollections = getNestedCollections(document);
            if (nestedCollections.length > 0) {
                if (!document.id) {
                    addToSet(table.columns, "id");
                    document.id = getNextAvailableId();
                }
                nestedCollections
                        .forEach((nestedCollection) => {
                            loadObjectIntoTable(nestedCollection, document[nestedCollection], tableName, document.id);
                        });
            }
            addToSet(usedIds, document.id);
            table.rows.push(
                    getRow(document, table.columns));
        });
    }

    function setFieldToAllDocuments(objects, field, value) {
        objects.forEach(object => object[field] = value);
    }

    function loadObjectIntoSchemaAsTable(collectionName, documents) {
        var table = getOrCreateTable(collectionName);
        documents.forEach(document => {
            getPrimitiveFields(document)
                    .forEach((field) => addToSet(table.columns, field));
            getNestedCollections(document)
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

    function addToSet(array, value) {
        if (array.indexOf(value) === -1) {
            array.push(value);
        }
    }

    module.exports = {
        getTables: getTables
    };

})();
