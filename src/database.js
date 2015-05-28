/**
 * Created by jpsoroulas.
 */
/**
 * Exports the mongodb database objected used to store the endpoint status history.
 *
 * ###Exported objects
 * __{{#crossLink "DBConnectionFactory"}}{{/crossLink}}__
 *
 * @module database
 */
'use strict';
var mongojs = require('mongojs');

/**
 * Creates mongodb database object, used to store the endpoint status history.
 *
 * @class DBConnectionFactory
 * @static
 */
module.exports = {
    /**
     * Creates a mongoDB database connection.
     * @static
     * @method create
     * @param {String} [connectionURL] the mongoDB connection url. If empty the default connection url
     * 'mongodb://localhost:27017/' is used.
     *
     * @return the mongoDB connection.
     */
    create: function create(connectionURL) {
        connectionURL = connectionURL || 'mongodb://localhost:27017/';
        return mongojs(connectionURL + 'watcherjs', ['history']);
    }
};
