var lodash = require("lodash");

(function () {

    function snakeCaseifyColumns(schema) {
        schema.forEach(table =>
            table.columns = table.columns.map(lodash.snakeCase)
        );
    }

    module.exports = {
        snakeCaseifyColumns: snakeCaseifyColumns
    };

})();
