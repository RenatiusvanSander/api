/**
 * The inventory-api provides several web-adresses for different tasks like borrow, return, scan, insert and hands
 * out a list of inventory-items.
 * @class app
 * @static
 */
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute express
 * @type {String} express is a layer for several more functions based on NodeJS
 * @required
 */
var express = require('express');
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute path
 * @type {String} path to the directories in nodejs
 * @required
 */
var path = require('path');
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute favicon
 * @type {String} favicon for the webserver
 * @required
 */
var favicon = require('serve-favicon');
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute logger
 * @type {String} logger to log everything
 * @required
 */
var logger = require('morgan');
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute cookieParser
 * @type {String} cookieParser understands and parses cookies
 * @required
 */
var cookieParser = require('cookie-parser');
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute bodyParser
 * @type {String} bodyParser understands HTTP-bodies
 * @required
 */
var bodyParser = require('body-parser');
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute Sequelize
 * @type {String} Sequelize managesour model and transports them to database
 * @required
 */
var Sequelize = require('sequelize');
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute expressValidator
 * @type {String} expressValidator validates every sent information from post, get, delete
 * @required
 */
var expressValidator = require('express-validator');
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute cors
 * @type {String} cors supports javascript headers and provides a whitelist
 * @required
 */
var cors = require('cors');
var url = require('url');
var swaggerJSDoc = require('swagger-jsdoc');
var swagger = require('swagger-node-express');

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'inventory-API',
    version: '1.0.0',
    description: 'Demonstrating what the api contains',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
var swaggerOptions = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./app/conifg/routes.js'],
};

var swaggerSpec = swaggerJSDoc(swaggerOptions);


/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute InventoryItemModel
 * @type {Class} InventoryItemModel stores the database model
 * @required
 */
// InventoryItemModel and config are defined
var InventoryItemModel = require('./app/models/inventory-item.js');
/**
 * stores a configuration for the app like databse connection
 *
 * @attribute config
 * @readOnly
 * @default true
 * @type json
 */
var config = require('./app/config/config.json');

/*
 * do not needed
var index = require('./routes/index');
var users = require('./routes/users');
*/

/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute app
 * @type {Object} app is an express object that has every method for the app
 * @required
 */
var app = express();

var subPath = express();

/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute corsOptions
 * @type {String} corsOption configures the cors
 * @required
 */
// --------- cors whitelist
var corsOptions = require('./app/config/cors-options');
// ---------- end cors whitelist

/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute dbConnection
 * @type {Object} dbConnection has an database connection
 * @required
 */
var dbConnection;

/**
 * Sets the views for browsers and the view generator like jade
 *
 * @method set
 * @return {Null} Copy of ...
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/**
 * use activates several modules like cors, logger, bodyParser,
 * express-validator, cookieParser and static shown directories
 * to outside.
 *
 * @method app.use
 * @param {Object} cors and has vary corsOption
 * @required
 */
app.use(cors(corsOptions));
/**
 * sets logger setup and start it
 *
 * @method app.use
 * @param {Object} logger and setting are dev
 * @required
 */
app.use(logger('dev'));
/**
 * use activates bodyParser.json() method
 *
 * @method app.use
 * @param {Object} bodyParser.json() and setting are dev
 * @required
 */
app.use(bodyParser.json());
/**
 * use activates bodyParser.urlencoded({extended: false}) method
 *
 * @method app.use
 * @param {Object} bodyParser.urlencoded({extended: false}) and settings for
 * encoding
 * @required
 */
app.use(bodyParser.urlencoded({extended: false}));
/**
 * use activates expressValidator for HTTP-Body validation
 *
 * @method app.use
 * @param {Object} expressValidator starts
 * @required
 */
app.use(expressValidator());
/**
 * use activates cookieParser for HTTP-Body validation
 *
 * @method app.use
 * @param {Object} cookieParser starts
 * @required
 */
app.use(cookieParser());
/**
 * use activates static and viewable folders like public
 *
 * @method app.use
 * @param {Object} express.static activate a public folder
 * @required
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use("/",subPath);

/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute routes
 * @type {Object} routes reacts on event triggered http-request and answers them
 * @required
 */
var routes = require('./app/config/routes.js')(app);

//app.use('/', index);
//app.use('/users', users);

//for documentation outside
//swagger.setAppHandler(app);

/**
 * Fired when global an error occurs...
 *
 * @method app.use
 * @return {Object} error object
 * @event error
 * @param {String} err Not Found HTTP-StatusCode 404
 * @required
 */
// check this error handler for need
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * establishes database connection and returns an object of connection
 *
 * @class connectSequelize
 * @constructor
 * @return {Object} sequelize object of database connection
 * @required
 */
// database conncetion is handled here
function connectSequelize() {
  // connect to database

  // begin connect
  try {
    var sequelize = new Sequelize(config.database, config.username, config.password, config.options);
  }
  catch (err) {
    // error handler
    console.log(err);
  }

  /* second way
   var uri = dialect + '://' + un + ':' + pw + '@' + host + ':' + port + '/'  + db;
   var sequelize = new Sequelize(uri);
   */

  // try connection
  return sequelize
    .authenticate()
    .then(function () {
      return sequelize;
    })
    .then(function (result) {
      dbConnection = result;
      return dbConnection;
    })
    .catch(function (err) {
      // handle connection error
      if (err.name.contains('Sequelize')) {
        // log help message
        console.log('Please, check DNS, firewall, appArmor and mySQL');
        return false;
      }
    });
}

/**
 * Fired when global an error occurs...
 *
 * @method app.use
 * @return {Object} error object
 * @event error
 * @param {String} err Not Found HTTP-StatusCode 404
 * @param {Object} req carries the http-request as Object
 * @param {Object} res carries the response object
 * @param {Object} next jumps to next method or to the error handler
 * @required
 */
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.message == "Validation failed") {
    err.status = 400;
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute module.exports
 * @required
 */
module.exports = app;

/**
 * on succes starts the app.js and on error it stops
 *
 * @method connectSequelize().then()
 * @return {Object} Copy of Sequelize Object
 * @required
 */
connectSequelize()
  .then(function (result) {
    // start server and bind to port 3000
    app.listen(3000, function () {
      console.log('REST API listens on port 3000!');
    });
  })
  .catch(function (err) {
    if (err.name == 'TypeError') {
      console.log('Connection error: ' + err);
    }
  });