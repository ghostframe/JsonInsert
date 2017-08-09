(function () {

     function readCollectionSchema(collectionSchemaString) {
        var collectionSchema;
        eval("collectionSchema = " + collectionSchemaString);
        return Object.keys(collectionSchema).map(key => {
            return {
                name: key,
                documents: collectionSchema[key]
            };
        });
    }
    
    module.exports = {
        readCollectionSchema: readCollectionSchema
    };

})();
