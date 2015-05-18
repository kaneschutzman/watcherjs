/**
 * Created by jpsoroulas.
 */
/**
 * Exports the mongodb database objected used to store the endpoint status history.
 *
 * ###Exported objects
 * __{{#crossLink "Db"}}{{/crossLink}}__
 *
 * @module database
 */
'use strict';
var mongojs = require('mongojs');
var db = mongojs('watcherjs', ['history']);

/**
 * The mongodb database object, used to store the endpoint status history.
 *
 * @class Db
 * @static
 */
module.exports = db;
