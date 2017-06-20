(function () {

    var tables;

    function getTables(rootTableName, rootTableObject) {
        tables = [];
        loadTablesAndColumns(rootTableName, rootTableObject);
        loadObjectAsTable(rootTableName, rootTableObject);
        return tables;
    }

    function loadObjectAsTable(collectionName, documents) {
        var table = getOrCreateTable(collectionName);
        documents.forEach(function (document) {
            table.rows.push(
                    getRow(document, table.columns));
            getNestedCollections(document)
                    .forEach((nestedCollection) => {
                        loadObjectAsTable(nestedCollection, document[nestedCollection]);
                    });
        });
    }

    function loadTablesAndColumns(collectionName, documents) {
        var table = getOrCreateTable(collectionName);
        documents.forEach(document => {
            getPrimitiveFields(document)
                    .forEach((field) => addToSet(table.columns, field));
            getNestedCollections(document)
                    .forEach((nestedCollection) => loadTablesAndColumns(nestedCollection, document[nestedCollection]));
        });
    }

    function getOrCreateTable(tableName) {
        var tableWithRequestedName = tables.find(table => table.name === tableName);
        if (tableWithRequestedName) {
            return tableWithRequestedName;
        } else {
            return addTable(tableName);
        }
    }

    function addTable(tableName) {
        var newTable = {
            name: tableName,
            columns: [],
            rows: []
        };
        tables.push(newTable);
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

    function addColumnnsOf(documents, columns) {
        documents.forEach(document => {
            getPrimitiveFields(document)
                    .forEach(primitiveField => addToSet(columns, primitiveField));
        });
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
