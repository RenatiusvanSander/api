var expressValidator = require('express-validator');
var InventoryItemModel = require('../models/inventory-item');


// send response if at root is requested
var getApiUptime = function (req, res) {
  res.send('The API is up for ' + process.uptime() + ' seconds. It is awesome ;-) !');
  return false;
};

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

var getScannedInventoryItems = function (req, res, next) {
  //return all inventory items
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

// borrows Inventory-Items via BarcodeApp
var getBorrowInventoryItem = function (req, res, next) {
  // borrow Inventory-Items here
  if(isNaN(req.query.barcode)) {
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

var validateDeleteInventoryItems = function(req, res, next) {
  req.checkParams('inventoryNo').notEmpty().isInt();
  req.getValidationResult()
    .then(function (result) {
      result.throw();
      next();
    })
    .catch(next());
};

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