var singular = require("pluralize").singular;
var _ = require("lodash");

(function () {

    var configuration;

    function init() {
        configuration = {
            prefix: "",
            suffix: "",
            singularize: false
        };
    }

    function generateForCollectionNamed(collectionName, configurationProvided) {
        init();
        _.assign(configuration, configurationProvided);
        if (configuration.singularize) {
            collectionName = singular(collectionName);
        }
        return configuration.prefix + collectionName + configuration.suffix;
    }

    module.exports = {
        generateForCollectionNamed: generateForCollectionNamed,
        configuration: configuration
    };
})();