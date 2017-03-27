/* it is important to load the Controller
 before it is in use
 */
var inventoryItemController = require('../controllers/inventory-item.js');

// exports to app.js
module.exports = function (app) {
  app.get('/', inventoryItemController.getApiUptime);
  app.get('/api/inventory-items/', inventoryItemController.getInventoryItems);
  app.get('/api/inventory-items/borrow-items/',
    inventoryItemController.validateBarcodeRequest,
    inventoryItemController.getBorrowInventoryItem);
  app.get('/api/inventory-items/return-items',
    inventoryItemController.validateBarcodeRequest,
    inventoryItemController.getReturnInventoryItem);
  app.get('/api/inventory-items/scanned-item',
    inventoryItemController.validateBarcodeRequest,
    inventoryItemController.getScannedInventoryItems);
  app.post('/api/inventory-items',
    inventoryItemController.validateInsertInventoryItems,
    inventoryItemController.postInventoryItems);
  app.delete('/api/inventory-items/:inventoryNo',
    inventoryItemController.validateDeleteInventoryItems,
    inventoryItemController.deleteInventoryItems);
};