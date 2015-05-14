/**
 * Created by jpsoroulas.
 */

/**
 * ###Overview
 * Provides the utilities.
 * Exported objects:
 * * __{{#crossLink "EventDispatcherFactory"}}{{/crossLink}}__
 * * __{{#crossLink "EventDispatcher"}}{{/crossLink}}__
 * * __{{#crossLink "DictionaryFactory"}}{{/crossLink}}__
 * * __{{#crossLink "TransactionalExecutor"}}{{/crossLink}}__
 *
 * ###API Usage samples
 *    ```javascript
 * //DictionaryFactory
 * var dictionary = dictionaryFactory.create();
 * var value = {};
 * dictionary.put('key', value);
 * value = dictionary.get('key');
 *    ```

 *    ```javascript
 * //eventDispatcher
 * var dispatcher =  eventDispatcher.create({
 *     emitter: new events.EventEmitter()
 * });
 *    ```
 *
 *    ```javascript
 * //eventDispatcherFactory
 * var dispatcher = eventDispatcherFactory.create();
 *    ```
 * @module utils
 */
'use strict';
var events = require('events');
var _ = require('underscore');
var async = require('async');
var stampit = require('stampit');
//var fs = require('fs');
//var async = require('async');

var eventDispatcher, eventDispatcherFactory, dictionary, dictionaryFactory, transactionalExecutor;

/**
 * Exposes the event emitter functionality (a delegator).
 *
 * @class EventDispatcher
 */
eventDispatcher = stampit().state({
    emitter: void 0
}).enclose(function () {
    /**
     * Adds a listener to the end of the listeners array for the specified event. No checks are
     * made to see if the listener has already been added.
     *
     * @method on
     * @param {String} event the event.
     * @param {Function} listener the event listener.
     */
    this.on = function on(event, listener) {
        this.emitter.on(event, listener);
    };

    /**
     * Execute each of the listeners in order with the supplied arguments.
     *
     * @method emit
     * @param {String} event the event.
     * @param {Function} [, l1][, l2][, ...] the listeners.
     * @return {boolean} true  if event had listeners, false otherwise.
     */
    this.emit = function emit(event) {
        // if you do not set as context the this.emitter the apply does not work
        return this.emitter.emit.apply(this.emitter, _.toArray(arguments));
        // or simply call
        //return this.emitter.emit.apply(this.emitter, arguments);
    };

    /**
     * Removes all listeners, or those of the specified event.
     *
     *  @method removeAllListeners
     *  @param {String} [event] the event.
     */
    this.removeAllListeners = function removeAllListeners(event) {
        this.emitter.removeAllListeners(event);
    };

});

/**
 * EventDispatcher factory
 * @class EventDispatcherFactory
 * @static
 */
eventDispatcherFactory = {
    /**
     * creates an EventDispatcher instance.
     * For each instance a delegate emitter is created.
     * @static
     * @method create
     * @return {EventDispatcher} the EventDispatcher instance.
     */
    create: function create() {
        return eventDispatcher.create({
            emitter: new events.EventEmitter()
        });
    }
};


/**
 * Provides a map collection like functionality.
 *
 * @class Dictionary
 */
dictionary = stampit()
    .state({
        /**
         * An empty object (the map).
         *
         * @property elements
         * @type Object
         */
        elements: Object.create(null)
    }).methods({
        /**
         * Returns the property value with the specific key.
         *
         * @method get
         * @param {String} key the property key.
         * @return {Object} the property value.
         */
        get: function get(key) {
            if (_.has(this.elements, key)) {
                return this.elements[key].val;
            }
        },

        /**
         * Sets the property value with the specific key.
         *
         * @method set
         * @param {String} key the property key.
         * @param {Object} val the property value.
         */
        set: function set(key, val) {
            this.elements[key] = {val: val};
        },

        /**
         * Checks if the property of the specific key exists.
         *
         * @method contains
         * @param {String} key the property key.
         * @return {boolean} true if exists, otherwise false.
         */
        contains: function contains(key) {
            return _.has(this.elements, key);
        },

        /**
         * Removes the property of the specific key.
         *
         * @method remove
         * @param {String} key the property key.
         */
        remove: function remove(key) {
            delete this.elements[key];
        },

        /**
         * Removes all properties.
         *
         * @method removeAll
         */
        removeAll: function removeAll() {
            for (var key in this.elements) {
                this.remove(key);
            }
        },

        /**
         * Checks if the dictionary is empty.
         *
         * @method isEmpty
         * @return {boolean} true if is empty, otherwise false.
         */
        isEmpty: function isEmpty() {
            _.isEmpty(this.elements);
        },

        /**
         * foreach dictionary method implementation.
         *
         * @method foreach
         * @param {Function} callback the callback.
         * @param {String} context the execution context.
         */
        foreach: function foreach(callback, context) {
            _.each(this.elements, callback, context);
        },

        /**
         * Returns the size of the dictionary.
         *
         * @method size
         * @return {int} the dictionary size.
         */
        size: function size() {
            return _.keys(this.elements).length;
        },

        /**
         * Returns the keys of the dictionary.
         *
         * @method keys
         * @return {Array} the dictionary keys.
         */
        keys: function keys() {
            return _.keys(this.elements);
        },

        /**
         * Returns the values of the dictionary.
         *
         * @method keys
         * @return {Array} the dictionary values.
         */
        values: function values() {
            return _.map(_.values(this.elements), function (wrapper) {
                return wrapper.val;
            });
        }
    });

/**
 * Dictionary factory
 * @class DictionaryFactory
 * @static
 * @return {Dictionary} a dictionary instance.
 */
dictionaryFactory = {
    /**
     * creates a Dictionary instance.
     * @static
     * @method create
     * @return {Dictionary} the Dictionary instance.
     */
    create: function create() {
        return dictionary.create({
            elements: Object.create(null)
        });
    }
};

/**
 * Enables functions transactional execution
 * @class TransactionalExecutor
 * @static
 */
transactionalExecutor = {
    /**
     * Executes the provided operations transactional.
     * @static
     * @method execute
     * @param {Array} ops the array of functions for execution.
     * @param {Function} [onCompletedCallback] on transaction complete callback.
     * @param {String} [type] the async type model, 'series' or 'waterfall'.
     */
    execute: function execute(ops, onCompletedCallback, type) {
        onCompletedCallback = onCompletedCallback || _.noop;
        type = type || 'series';
        var asyncFun = (type === 'series' ? async.series : async.waterfall);
        var cc = 0;
        var exeOps = _.map(_.pluck(ops, 'execute'), function (exOp) {
            return _.wrap(exOp, function (func, callback) {
                cc++;
                func(callback);
            });
        });
        asyncFun(exeOps, function (errors, results) {
            if (errors) {
                for (var i = 0; i < cc - 1; i++) {
                    ops[i].rollback();
                }
            }
            onCompletedCallback(errors, results);
        });
    }
};

module.exports = {
    eventDispatcher: eventDispatcher,
    eventDispatcherFactory: eventDispatcherFactory,
    dictionaryFactory: dictionaryFactory,
    transactionalExecutor: transactionalExecutor
};
