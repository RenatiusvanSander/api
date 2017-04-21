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
var swaggerJSDoc = require('swagger-jsdoc');


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
  apis: ['./.../public/api-docs/*.js'],
};

var swaggerSpec = swaggerJSDoc(swaggerOptions);

// exports to app.js
module.exports = function (app) {
  // serve swagger
  app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

/****************Swagger definitions******************************************/
/**
  * @swagger
  * definitions:
  *   InventoryItem:
  *          type: object
  *      required:
  *        - id
  *        - inventoryNo
  *        - barcode
  *        - itemname
  *        - fixLocation
  *        - borrower
  *        - itemState
  *        - comment
  *        - createdAt
  *        - updatedAt
  *      properties:
  *        id:
  *           type: long
  *            minimum: 1
  *            maximum: 10000
  *        inventoryNo:
  *          type: integer
  *          minimum: 1
  *          maximum: 10000
  *        barcode:
  *          type: integer
  *          minimum: 1
  *          maximum: 10000
  *        itemname:
  *          type: string
  *        fixLocation:
  *          type: string
  *        borrower:
  *          type: string
  *        itemState
  *          type: string
  *          enum: [active, deleted]
  *        comment:
  *          type:string
  *        createdAt:
  *          type: string
  *          format: date-time
  *        updatedAt:
  *          type: string
  *          format: date-time
/*****************************End Swagger definitions*************************/

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
  /**
   * @swagger
   * /:
   *   get:
   *     tags:
   *       - Api Uptime
   *     description: Returns API uptime
   *     produces:
   *       - text/html
   *     responses:
   *       200:
   *         description: Server uptime in seconds
   *         schema:
   *           type: array
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
  /**
   * @swagger
   * /api/inventory-items/:
   *   get:
   *     description: returns all inventory-items
   *       produces:
   *         - application/json
   *       responses:
   *         200:
   *           description: An array of inventory-items
   *           schema:
   *             $ref: '#definitions/InventoryItem'
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
  /**
   * @swagger
   * /api/inventory-items/borrow-items:
   *   get:
   *     tags:
   *       name: borrowItem
   *       description: an inventory-item is borrowed
   *     produces:
   *       text/html
   *     parameters:
   *       - name: barcode
   *         description: scanned barcode to find the item
   *         type: string
   *       - name: borrower
   *         description: the borrower's name
   *         type: string
   *     responses:
   *       200:
   *         description: OK
   *      default:
   *        description: Not Found
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
  /**
   @swagger
   * /api/inventory-items/return-items:
   *   get:
   *     summary: returns an inventory-item to the pool
   *     produces:
   *       text/html
   *     parameters:
   *       - name: barcode
   *         description: a scanned barcode
   *         type: string
   *     responses:
   *       200:
   *         description: OK
   *      default:
   *        description: Not Found
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
  /**
   @swagger
   * /api/inventory-items/scanned-item:
   *   get:
   *     summary: returns information about a scanned barcode
   *     produces:
   *       text/html
   *     parameters:
   *       - name: barcode
   *         description: a scanned barcode
   *         type: string
   *     responses:
   *       304:
   *         description: sends an InventoryItem
   *         schema:
   *           $ref: '#/definitions/InventoryItem'
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
  /**
   * @swagger
   *   paths:
   *    /api/inventory-items:
   *      post:
   *        summary: inserts an InventoryItem to database
   *        consumes:
   *          - application/x-www-form-urlencoded
   *        parameters:
   *          - in: formData
   *            name: inventoryNo
   *            type: string
   *            required: true
   *            description: inventory number
   *          - in: formData
   *            name: barcode
   *            type: string
   *            required: true
   *            description: a barcode on the inventory
   *          - in: formData
   *            name: itemname
   *            type: string
   *            required: true
   *            description: the iname of the item
   *          - in: formData
   *            name: fixLocation
   *            type: the fiexed location of an inventory-item
   *            required: true
   *          - in: formData
   *            name: borrower
   *            type: string
   *            description: the borrower's name
   *            required: false
   *          - in: formData
   *            name: itemState
   *            type: string
   *            enum: [active, deleted]
   *            required: true
   *          - in: formData
   *            name: comment
   *            type: string
   *            required: false
   *         responses:
   *           200: OK
   *             description: creates an inventory-item and store in database
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
  /**
   * @swagger
   *   path:
   *     /api/inventory-items/:inventoryNo:
   *       delete:
   *         summary: deletes an inventory
   *         parameters:
   *           - in: formData
   *             name: inventoryNo
   *             type: string
   *             required: true
   *         responses:
   *           200:
   *             description: OK
   */
  app.delete('/api/inventory-items/:inventoryNo'/*,
    inventoryItemController.validateDeleteInventoryItems*/,
    inventoryItemController.deleteInventoryItems);
};