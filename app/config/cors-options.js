/**
 * Created by remy on 13/03/17.
 */
var apiWhitelist = require('./cors-whitelist.js');
module.exports = {
  origin: function(origin, callback) {
    var isWhitelisted = apiWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials:true
}