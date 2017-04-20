/* it is important to load the Controller
 before it is in use
 */
/**
 * Provides more features for the widget module...
 *
 * @module routes
 * @submodule routes-inventoryItemController
 * @main routes
 * @required
 */
var inventoryItemController = require('../controllers/inventory-item.js');

// exports to app.js
module.exports = function (app) {
  /**
   * export class and the methods
   *
   * @class function
   * @Param {Object} app is a object that stores app-settings
   * @method get every shot request on different adresses
   * @return {Object} only an error object if that happens ...
   * @event request
   * @param {File} An answer file is generated and send to user
   * @required
   */
  /**
   * Returns the api uptime
   *
   * @method app.get
   * @event receives request
   * @Param {String} path stores the webaddress path
   * @Param {Method} getInventoryItems
   * @required
   */
  app.get('/', inventoryItemController.getApiUptime);
  /**
   * Returns a list of inventory-items for webaddress
   * /api/inventory-items/
   *
   * @method app.get
   * @event receives request
   * @Param {String} path stores the webaddress path
   * @Param {Method} getBorrowInventoryItem
   * @required
   */
  app.get('/api/inventory-items/', inventoryItemController.getInventoryItems);
  /**
   * borrow a scanned-item of inventory-items for webaddress
   * /api/inventory-items/borrow-items
   *
   * @method app.get
   * @event receives request
   * @Param {String} path stores the webaddress path
   * @Param {Method} getBorrowInventoryItem
   * @required
   */
  app.get('/api/inventory-items/borrow-items',
    inventoryItemController.getBorrowInventoryItem);
  /**
   * returns an inventory-items to the pool, The webaddress
   * /api/inventory-items/return-items
   *
   * @method app.get
   * @event receives request
   * @Param {String} path stores the webaddress path
   * @Param {Method} validateBarcodeRequest
   * @Param {Method} getReturnInventoryItem
   * @required
   */
  app.get('/api/inventory-items/return-items',
    inventoryItemController.validateBarcodeRequest,
    inventoryItemController.getReturnInventoryItem);
  /**
   * returns data of an inventory-item, The webaddress
   * /api/inventory-items/scanned-item
   *
   * @method app.get
   * @event receives request
   * @Param {String} path stores the webaddress path
   * @Param {Method} validateBarcodeRequest
   * @Param {Method} getScannedInventoryItems
   * @required
   */
  app.get('/api/inventory-items/scanned-item',
    inventoryItemController.validateBarcodeRequest,
    inventoryItemController.getScannedInventoryItems);
  /**
   * insert an inventory-item by post on
   * /api/inventory-items
   *
   * @method post
   * @event receives request
   * @Param {String} path /api/inventory-items
   * @Param {Method} validateInsertInventoryItems
   * @Param {Method} postInventoryItems
   * @required
   */
  app.post('/api/inventory-items',
    inventoryItemController.validateInsertInventoryItems,
    inventoryItemController.postInventoryItems);
  /**
   * on this address is an inventoryItem deleted.
   * /api/inventory-items/:inventoryNo
   *
   * @method delete
   * @event receives request
   * @Param {String} path /api/inventory-items/:inventoryNo
   * @Param {Method} deleteInventoryItems
   * @required
   */
  app.delete('/api/inventory-items/:inventoryNo'/*,
    inventoryItemController.validateDeleteInventoryItems*/,
    inventoryItemController.deleteInventoryItems);
};