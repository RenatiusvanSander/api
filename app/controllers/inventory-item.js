/**
 * Provides more features for the widget module...
 *
 * @module routes-inventoryItemController
 * @main routes
 */
/**
 * A required attribute
 * that is required for proper
 * use, module will likely fail
 * if this is not provided.
 *
 * @attribute expressValidator
 * @type {Object} expressValidator validates inputs for the functions
 * @required
 */
var expressValidator = require('express-validator');
/**
 * A class provides an ORM for the inventory-item, which is mapped to database
 * as a table and stores the entries for inventory-items.
 *
 * @class InventoryItemModel
 * @constructor
 * @required
 */
var InventoryItemModel = require('../models/inventory-item');

/**
 * Return the Api Uptime to the requester.
 *
 * @method getApiUptime
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @return {Object} send the uptime of api to the request
 */
// send response if at root is requested
var getApiUptime = function (req, res) {
  res.send('The API is up for ' + process.uptime() + ' seconds. It is awesome ;-) !');
  return false;
};

/**
 * Return an serialized JSON. It contains the requested inventory-item.
 *
 * @method getInventoryItems
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @return {Object} send an inventory item serialized as JSON back to requester
 */
// get Inventory Items from DB
var getInventoryItems = function (req, res) {
  //return all inventory items

  // answer barcode calls
  InventoryItemModel
    .findAll()
    .then(function (result) {
      // here is got query result

      // send back as json object
      if (result.length > 0) {
        res.json(result);
      }
      else {
        // send an error back
        res.status(404).json({error: 'None query matched with db content!'});
      }
    })
    .catch(function (error) {
      // error handler
      console.log('deleteInventoryItems: ' + error);
      res.status(500).json({error: 'Query failed: ' + error});
      return false;
    });
};

/**
 * Return an serialized JSON. It contains the requested inventory-item
 * by a scanned barcode from BarcdeScan App.
 *
 * @method getScannedInventoryItems
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @param {Object} next jumps to the next method
 * @return {Object} send an inventory item serialized as JSON back to requester
 */
// gets a barcode and return data about an inventory-item
var getScannedInventoryItems = function (req, res, next) {
  var item_barcode = req.query.barcode; // inputted barcode

  // prepared query
  var query = {
    where: {
      barcode: item_barcode
    }
  };

  // answer barcode calls
  InventoryItemModel
    .findAll(query)
    .then(function (result) {
      // here is got query result

      // send back as json object
      if (result.length > 0) {
        res.json(result);
      }
      else {
        // send an error back
        return res.status(404).json({error: 'None query matched with db content!'});
      }
    })
    .catch(function (err) {
      // error handler
      console.log('deleteInventoryItems: ' + err);
      return res.status(500).json({error: 'Query failed: ' + err});
      //return false;
    });
};

/**
 * Return an serialized JSON. It contains the requested inventory-item.
 *
 * @method getInventoryItems
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @param {Object} next jumps to global error handler or to next method
 * @return {Object} send an inventory item serialized as JSON back to requester
 */
// borrows Inventory-Items via BarcodeApp
var getBorrowInventoryItem = function (req, res, next) {
  // borrow Inventory-Items here
  // check if it is not a numeric barcode
  if(isNaN(req.query.barcode)) {
    // response with an Not Found and include validation error
    res.status(404).send('There have been validation errors!');
  }

  var inventoryItemBarcode = req.query.barcode; // inputted barcode
  var inventoryItemBorrower = req.query.borrower; // inputted borrower

  InventoryItemModel
    .update({
        borrower: inventoryItemBorrower
      },
      {
        where: {
          barcode: inventoryItemBarcode
        }
      })
    .then(function (result) {
      // response sends inventory Item
      res.json(result);
    })
    .catch(function(err) {
      next();
    }); // use error handler in app.js

};

/**
 * validates input and throws error object or goes to next method.
 *
 * @method validateInsertInventoryItems
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @param {Object} next jumps to global error handler or to next method
 * @return {Object} throws an error object to global error handler or jumps
 * to next method
 */
var validateInsertInventoryItems = function (req, res, next) {
  req.check('itemname', '').notEmpty().isAlpha('de-DE');
  req.check('barcode', '').notEmpty().isInt();
  req.check('inventoryNo', '').notEmpty().isNumeric();
  req.check('fixLocation', '').notEmpty().isAlpha('de-DE');
  req.check('comment', '').isAlpha('de-DE');
  req.getValidationResult()
    .then(function (result) {
      result.throw();
      next();
    })
    .catch(next());
};

/**
 * Return an serialized JSON. It contains the requested inventory-item.
 *
 * @method validateDeleteInventoryItems
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @param {Object} next jumps to global error handler or to next method
 * @return {Object} throws an error object to global error handler or jumps
 * to next method
 */
var validateDeleteInventoryItems = function(req, res, next) {
  req.checkParams('inventoryNo').notEmpty().isInt();
  req.getValidationResult()
    .then(function (result) {
      result.throw();
      next();
    })
    .catch(next());
};

/**
 * Returns an inventory-item in JSON to requester.
 *
 * @method getReturnInventoryItem
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @param {Object} next jumps to global error handler or to next method
 * @return {Object} throws an error object to global error handler or jumps
 * to next method
 */
// return borrowed Inventory-Items
var getReturnInventoryItem = function (req, res, next) {
  // returns borrowed items
  var inventoryItemBarcode = req.query.barcode; // inputted barcode

  // remove borrower from database table
  return InventoryItemModel
    .update(
      {
        borrower: ''
      },
      {
        fields: ['borrower'],
        where: {
          barcode: inventoryItemBarcode
        }
      }
    )
    .then(function (result) {
      // send ok or error if result is 0
      if (result[0] == 0) {
        res.sendStatus(404);
      }
      else {
        res.sendStatus(202);
      }
    })
    .catch(function(err) {
      next();
    });
};

/**
 * create an inventory-item by request
 *
 * @method postInventoryItems
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @param {Object} next jumps to global error handler or to next method
 * @return {Object} throws an error object to global error handler or jumps
 * to next method
 */
// create new inventory items
var postInventoryItems = function (req, res, next) {
  // validate the request
  var item_name = req.body.itemname; // item-name
  var item_barcode = req.body.barcode;  // item-barcode
  var item_borrower = req.body.borrower; // item-borrower
  var item_inventory_no = req.body.inventoryNo; // item-inventory-number
  var item_location = req.body.fixLocation; // item-position
  var item_comment = req.body.comment; // inventory-item comment

  // create the item or unique constraint error is thrown
  InventoryItemModel
    .create({
      barcode: item_barcode,
      itemname: item_name,
      inventoryNo: item_inventory_no,
      borrower: item_borrower,
      comment: item_comment,
      fixLocation: item_location,
      itemState: 'active'
    })
    // log the output
    .then(function () {
      // send created
      res.sendStatus(201);
    })
    .catch(function (err) {

      // ignore UniqueConstraintsError
      if (err.name == 'SequelizeUniqueConstraintError') {
        //continue the chain
        res.sendStatus(201);
        return;
      }
      else {
        next();
      }
    });

};

/**
 * deletes an inventory-item by update itemStatus to deleted.
 *
 * @method deleteInventoryItems
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @param {Object} next jumps to global error handler or to next method
 * @return {Object} throws an error object to global error handler or jumps
 * to next method
 */
// delete an InventoryItem
var deleteInventoryItems = function (req, res, next) {
  if(isNaN(req.params.inventoryNo)) {
    res.status(404).send('There have been validation errors!');
  }
  var itemInventoryNo = req.params.inventoryNo; // item-inventory-number

  // model updates the entry to ENUM deleted
  InventoryItemModel
    .update(
      {
        itemState: 'deleted'
      },
      {
        fields: ['itemState'],
        where: {
          inventoryNo: itemInventoryNo
        }
      }
    )
    .then(function (result) {

      // send ok or error if result is 0
      if (result[0] == 0) {
        res.sendStatus(404);
      }
      else {
        res.sendStatus(200);
      }
    })
    .catch(function(err) {
      console.log(err);
      next();
    });
};

/**
 * deletes an inventory-item by update itemStatus to deleted.
 *
 * @method deleteInventoryItems
 * @param {Object} req contains the request
 * @param {Object} res contains response methods to answer requests
 * @param {Object} next jumps to global error handler or to next method
 * @return {Object} throws an error object to global error handler or jumps
 * to next method
 */
var validateBarcodeRequest = function (req, res, next) {
  req.checkQuery('barcode', 'Invalid Barcode').isNumeric(); // valid Number and not empty
  req.getValidationResult()
    .then(function (result) {
      result.throw();
      next();
    })
    .catch(function(err) {
      next();
    });
};

module.exports = {
  validateDeleteInventoryItems: validateDeleteInventoryItems,
  validateInsertInventoryItems: validateInsertInventoryItems,
  validateBarcodeRequest: validateBarcodeRequest,
  getInventoryItems: getInventoryItems,
  postInventoryItems: postInventoryItems,
  deleteInventoryItems: deleteInventoryItems,
  getApiUptime: getApiUptime,
  getBorrowInventoryItem: getBorrowInventoryItem,
  getReturnInventoryItem: getReturnInventoryItem,
  getScannedInventoryItems: getScannedInventoryItems
};