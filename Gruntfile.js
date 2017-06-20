module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.initConfig({
        mochaTest: {
            test: {
                src: ['test/**/*.js']
            }
        },
        mocha_istanbul: {
            coverage: {
                src: 'test', // a folder works nicely
                options: {
                    print: "none",
                    check: {
                        lines: 100,
                        statements: 100,
                        branches: 100,
                        functions: 100
                    }
                }
            }
        }
    });


    grunt.registerTask('test', 'mochaTest', 'mocha_istanbul', 'istanbul_check_coverage');
    grunt.registerTask('build', ['test']);
    grunt.registerTask('default', ['build']);

};