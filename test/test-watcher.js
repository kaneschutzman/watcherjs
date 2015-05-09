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
                        id: 'dummy',
                        type: 'http',
                        timeout: 100,
                        url: 'http://11.222.333.444:3333/?get-status'
                    }
                ]
            };
            watcher = app.watcherFactory.create(options).start();
        });

        it('a status request with wrong endpoint id, should return 404', function (done) {
            http.get('http://localhost:7777/endpoints/no-exist', function (res) {
                assert.equal(404, res.statusCode);
                done();
            });
        });

        it('a valid status request, with undetermined service status', function (done) {
            http.get('http://localhost:7777/endpoints/dummy', function (res) {
                assert.equal(200, res.statusCode);
                res.on('data', function (chunk) {
                    var service = JSON.parse(s(chunk).value());
                    assert.equal(service.status, 'unreachable');
                    done();
                });
            });
        });

        after(function () {
            watcher.stop();
        });
    });
});