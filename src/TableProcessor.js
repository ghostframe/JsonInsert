var lodash = require("lodash");

(function () {

    function snakeCaseifyColumns(tables) {
        tables.forEach(table =>
            table.columns = table.columns.map(lodash.snakeCase)
        );
    }

    module.exports = {
        snakeCaseifyColumns: snakeCaseifyColumns
    };

})();
