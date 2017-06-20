(function () {

    var tables;

    function getTables(rootTableName, rootTableObject) {
        tables = [];
        loadTablesAndColumns(rootTableName, rootTableObject);
        loadObjectIntoTable(rootTableName, rootTableObject);
        return tables;
    }

    function loadObjectIntoTable(tableName, documents, parentObjectName, parentObjectId) {
        var table = getOrCreateTable(tableName);
        if (parentObjectName) {
            var foreignKeyColumnName = parentObjectName + "_id";
            addToSet(table.columns, foreignKeyColumnName);
            setFieldToAllDocuments(documents, foreignKeyColumnName, parentObjectId);
        }
        documents.forEach(document => {
            table.rows.push(
                    getRow(document, table.columns));
            getNestedCollections(document)
                    .forEach((nestedCollection) => {
                        loadObjectIntoTable(nestedCollection, document[nestedCollection], tableName, document.id);
                    });
        });
    }
    
    function setFieldToAllDocuments(objects, field, value) {
        objects.forEach(object => object[field] = value);
    }

    function loadTablesAndColumns(collectionName, documents) {
        var table = getOrCreateTable(collectionName);
        documents.forEach(document => {
            getPrimitiveFields(document)
                    .forEach((field) => addToSet(table.columns, field));
            getNestedCollections(document)
                    .forEach((nestedCollection) => {
                        loadTablesAndColumns(nestedCollection, document[nestedCollection]);
                    });
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
