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
    
    function configure(newConfiguration) {
        _.assign(configuration, newConfiguration);
    }

    function generateForCollectionNamed(collectionName) {
        if (configuration.singularize) {
            collectionName = singular(collectionName);
        }
        return configuration.prefix + collectionName + configuration.suffix;
    }

    module.exports = {
        generateForCollectionNamed: generateForCollectionNamed,
        configure: configure,
        init: init
    };
})();