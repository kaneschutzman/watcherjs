/**
 * Created by jpsoroulas.
 */

/**
 * Validates the __{{#crossLink "Watcher"}}{{/crossLink}}__ configuration.
 *
 * ###Exported objects
 * __{{#crossLink "Validator"}}{{/crossLink}}__
 *
 * @module validator
 */
'use strict';
var _ = require('underscore');
var s = require('underscore.string');
var Validate = require('validate-arguments');

var logger = require('./logger');
var constants = require('./constants');
var socketConnectorType = constants.connectorType.socket;
var httpConnectorType = constants.connectorType.http;

var serverValidationSpec = {
    port: 'natural',
    host: 'string',
    interval: 'natural',
    routeExts: {
        //isa: {
        //    route: {
        //        isa: 'function'
        //    },
        //    path: {
        //        isa: 'string'
        //    }
        //},
        isa: 'Array',
        optional: true
    },
    nfOpts: {
        sender: {
            isa: 'string',
            optional: true
        },
        recipients: {
            isa: 'Array',
            optional: true
        },
        isa: 'Object',
        optional: true
    },
    resolutionStrategies: {
        isa: 'Array',
        optional: true
    }
};

var endpointValidationSpec = {
    id: 'string',
    type: 'string',
    desc: {
        isa: 'string',
        optional: true
    },
    host: {
        isa: 'string',
        optional: true
    },
    port: {
        isa: 'natural',
        optional: true
    },
    url: {
        isa: 'string',
        optional: true
    },
    timeout: {
        isa: 'natural',
        optional: true
    },
    active: {
        isa: 'boolean',
        optional: true
    },
    notify: {
        isa: 'boolean',
        optional: true
    },
    resolutionStrategy: {
        isa: 'object',
        optional: true
    }
};

/**
 * Exported module object
 */
/**
 * The validator
 *
 * @class Validator
 * @static
 */
module.exports = {
    /**
     * Validates the watcher's http embedded server options.
     *
     * @method validateServerConfig
     * @param {Object} config the server configuration.
     */
    validateServerConfig: function validateServerConfig(config) {
        var validationErrors = [];
        var resolutionStrategies = config.resolutionStrategies || [];
        var ids = _.pluck(resolutionStrategies, 'id');
        if (_.size(_.uniq(ids)) !== _.size(ids)) {
            validationErrors.push('duplicate resolution strategies ids');
        }
        var strategyInterface = ['resolveOnConnection', 'resolveOnConversation', 'resolveNow', 'reset'];
        _.each(resolutionStrategies, function (strategy) {
            _.each(strategyInterface, function (fun) {
                var impl = strategy.implementation;
                if (!_.isFunction(impl[fun])) {
                    validationErrors.push('strategy, \'' + impl +
                    '\', function implementation missing \'' + fun + '\'');
                }
            });
        });
        var valResult = Validate.named(config, serverValidationSpec);
        if (!valResult.isValid()) {
            validationErrors.push(valResult.errorString());
        }
        return validationErrors;
    },

    /**
     * Validates the service communication endpoint.
     *
     * @method validateEndpointConfig
     * @param {Object} config the endpoint configuration.
     * @param {Array} ids the endpoints ids.
     * @param {Object} resolutionStrategies the registered resolution strategies.
     * @return {Array} the validation errors, empty if no error exists.
     */
    validateEndpointConfig: function validateEndpointConfig(config, ids, resolutionStrategies) {
        var type = config.type, validationErrors = [], specsValResult;

        _.each(config, function (val, key, obj) {
            if (s.isBlank(val)) {
                obj[key] = void 0;
            }
        });

        ids.push(config.id);
        if (_.size(_.uniq(ids)) !== _.size(ids)) {
            validationErrors.push('duplicate endpoint ids');
        }

        var strategy = config.resolutionStrategy;
        if (strategy && !_.isFunction(strategy)) {
            strategy = _.find(resolutionStrategies, function (entry) {
                return strategy === entry.id;
            });
            if (strategy) {
                var id = strategy.id;
                config.resolutionStrategy = strategy.implementation;
                config.resolutionStrategy.id = id;
            } else {
                validationErrors.push('Unable to apply a no existing strategy \'' + strategy +
                '\' to the endpoint \'' + config.id + '\' ');
            }
        }

        switch (type) {
            case socketConnectorType:
                if (!_.isUndefined(config.port)) {
                    config.port = parseInt(config.port);
                }
                specsValResult = Validate.named(config, endpointValidationSpec);
                break;
            case httpConnectorType:
                var url = config.url;
                if (url) {
                    if (!(s.startsWith(url, 'http') || s.startsWith(url, 'https'))) {
                        validationErrors.push('Only http/https protocol supported.');
                    }
                }
                specsValResult = Validate.named(config, endpointValidationSpec);
                break;
            default:
                validationErrors.push('Can not prepare options for type: ' + type);
        }
        if (!specsValResult.isValid()) {
            validationErrors.push(specsValResult.errorString());
        }
        return validationErrors;
    }
};