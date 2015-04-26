module.exports = function (grunt) {
    'use strict';
    var banner = '/*\n<%= pkg.name %> <%= pkg.version %>';
    //banner += '- <%= pkg.description %>\n<%= pkg.repository.url %>\n';
    banner += '- <%= pkg.description %>\n';
    banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/**', 'doc/api/**']
            //release: ["path/to/another/dir/one", "path/to/another/dir/two"]
        },
        jshint: {
            all: ['src/*.js', 'src/routes/*.js', 'test/*.js', 'examples/*.js', 'Gruntfile.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        simplemocha: {
            options: {
                globals: ['expect'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'tap'
            },
            all: {src: ['test/*.js']}
        },
        //concat: {
        //    options: {
        //        separator: ';\n',
        //        banner: banner
        //    },
        //    build: {
        //        files: [{
        //            src: ['src/*.js'],
        //            dest: 'build/<%= pkg.name %>.js'
        //        }]
        //    }
        //},
        uglify: {
            options: {
                banner: banner
            },
            // http://gruntjs.com/configuring-tasks
            dynamic_mappings: {
                // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
                // runs and build the appropriate src-dest file mappings then, so you
                // don't need to update the Gruntfile when files are added or removed.
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: 'src/',      // Src matches are relative to this path.
                        //src: ['**/*.js'], // Actual pattern(s) to match.
                        src: ['*.js', 'routes/*.js'], // Actual pattern(s) to match.
                        dest: 'build/',   // Destination path prefix.
                        ext: '.js'    // Dest filepaths will have this extension.
                        //extDot: 'first'   // Extensions in filenames begin after the first dot
                    }
                ]
            }
            //build: {
            //    files: {
            //        'build/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']
            //    }
            //}
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST'
                },
                files: {
                    'src/public/js/templates/templates.js': ['src/views/*.hbs']
                }
            }
        },
        //jsdoc: {
        //    dist: {
        //        src: ['src/*.js', 'test/*.js'],
        //        jsdoc: './node_modules/.bin/jsdoc',
        //        options: {
        //            destination: 'api',
        //            template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
        //            configure: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json'
        //        }
        //
        //    }
        //},
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: ['./src/'],
                    outdir: './doc/api/'
                    //themedir: './node_modules/yuidoc-bootstrap-theme',
                    //helpers : ['./node_modules/yuidoc-bootstrap-theme/helpers/helpers.js']
                }
            }
        }
        //docco: {
        //    debug: {
        //        src: ['src/**/*.js'],
        //        options: {
        //            output: 'api/'
        //        }
        //    }
        //},
        //watch: {
        //    scripts: {
        //        files: ['Gruntfile.js', 'src/*.js', 'test/**/*.js'],
        //        tasks: ['development']
        //    }
        //}
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    //grunt.loadNpmTasks('grunt-jsdoc');
    //grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.registerTask('development', ['jshint', 'simplemocha']);
    grunt.registerTask('default',
        ['clean', 'jshint', 'yuidoc', 'simplemocha', 'handlebars', 'uglify']);
};
