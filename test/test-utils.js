/**
 * Created by jpsoroulas.
 */
'use strict';
//var expect = require('chai').expect;
var should = require('chai').should();
//var assert = require('chai').assert;

var utils = require('../src/utils');
var dictionaryFactory = utils.dictionaryFactory;

describe('utils', function () {
    describe('#dictionary', function () {
        it('returns the value when exists', function () {
            var dictionary = dictionaryFactory.create();
            dictionary.set('fooKey', {value: 'fooValue'});
            should.exist(dictionary.get('fooKey'));
        });

        it('returns the size of inserted values',
            function () {
                var dictionary = dictionaryFactory.create();
                dictionary.set('p1', 1);
                dictionary.set('p2', 2);
                dictionary.size().should.equal(2);
            }
        );

        it('foreach traverses the dictionary values and apply the callback',
            function () {
                var dictionary = dictionaryFactory.create();
                dictionary.set('p1', 1);
                dictionary.set('p2', 2);
                dictionary.foreach(function (valWrapper, key, obj) {
                    valWrapper.val *= 2;
                });
                dictionary.get('p1').should.equal(2);
                dictionary.get('p2').should.equal(4);
            }
        );
    });

});