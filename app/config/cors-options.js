/**
 * Created by remy on 13/03/17.
 */
/**
 * Provides the cors with options
 *
 * @module cors
 * @submodule cors-whitelist
 * @main cors
 * @required
 */

/**
 * Indicates whether this Widget
 * has been rendered...
 *
 * @attribute apiWhitelist
 * @default true
 * @type Object
 */
var apiWhitelist = require('./cors-whitelist.js');
module.exports = {
  /**
   * A utility that brokers HTTP requests...
   *
   * @class function
   * @constructor
   * @Param {Object} origin is a list String
   * @Param {Object} callback does hand over the String to cors module
   */
  origin: function(origin, callback) {
    var isWhitelisted = apiWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials:true
}