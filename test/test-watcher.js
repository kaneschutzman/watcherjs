/**
 * Created by jpsoroulas.
 */
'use strict';
var http = require('http');
var s = require('underscore.string');
var assert = require('chai').assert;

var app = require('../src/watcher');

describe('watcher', function () {
    describe('#test start watcher', function () {
        var watcher;
        //this.timeout(15000);
        beforeEach(function () {
            watcher = app.watcherFactory.create({
                port: 7777
            });
        });

        it('Watcher options should be populated', function () {
            assert.equal(watcher.options.port, 7777,
                'Watcher`s port default value should be overridden');
        });
    });

    describe('#test watcher status request', function () {
        var watcher;
        before(function () {
            var options = {
                endpoints: [
                    {
                        id: 'console',
                        type: 'http',
                        timeout: 2000,
                        url: 'http://localhost:7777/console'
                    }
                ]
            };
            watcher = app.watcherFactory.create(options).start();
        });

        it('a status request with wrong endpoint id, should return 404', function (done) {
            http.get('http://localhost:7777/endpoints/no-exist', function (res) {
                assert.equal(422, res.statusCode);
                done();
            });
        });

        it('a valid status request, with up service status', function (done) {
            http.get('http://localhost:7777/endpoints/console', function (res) {
                assert.equal(200, res.statusCode);
                res.on('data', function (chunk) {
                    var service = JSON.parse(s(chunk).value());
                    assert.equal(service.status, 'up');
                    done();
                });
            });
        });

        after(function () {
            watcher.stop();
        });
    });
});