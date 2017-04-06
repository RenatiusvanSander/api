var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var expressValidator = require('express-validator');
var cors = require('cors');

// InventoryItemModel and config are defined
var InventoryItemModel = require('./app/models/inventory-item.js');
var config = require('./app/config/config.json');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// --------- cors whitelist
var corsOptions = require('./app/config/cors-options');
// ---------- end cors whitelist

var dbConnection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors(corsOptions));
//app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./app/config/routes.js')(app);

//app.use('/', index);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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

module.exports = app;

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