/**
 * Created by jpsoroulas.
 */
/**
 * Exports a winston logger.
 *
 * ###Exported objects
 * __{{#crossLink "Logger"}}{{/crossLink}}__
 *
 * ###API Usage samples
 * See at [winston](https://github.com/winstonjs/winston)
 *
 * @module logger
 */
'use strict';
var winston = require('winston'), logger;

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);

logger = new ( winston.Logger )({
    transports: [
        new winston.transports.Console({
            level: 'debug', // Only write logs of debug level or higher
            colorize: true
        })
    ]
});
/**
 * Exported module object
 */
/**
 * The winston logger
 *
 * @class Logger
 * @static
 */
module.exports = logger;



