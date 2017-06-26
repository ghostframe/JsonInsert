(function () {

    function writeTableInserts(tables) {
        return tables.map(writeTableInsert).join("\n\n");
    }

    function writeTableInsert(table) {
        return "INSERT INTO "
                + table.name
                + " ("
                + writeColumns(table.columns)
                + ") VALUES\n"
                + writeRows(table.rows)
                + ";";
    }

    function writeColumns(columns) {
        return columns.join(", ");
    }

    function writeRows(rows) {
        return rows.map(writeRow).join(",\n");
    }

    function writeRow(row) {
        return "(" + row.map(writeValue).join(", ") + ")";
    }
    function writeValue(value) {
        if (value === undefined) {
            return "NULL";
        } else if (typeof value === "string") {
            return "'" + value + "'";
        } else {
            return value;
        }
    }

    module.exports = {
        writeTableInserts: writeTableInserts
    };

})();
