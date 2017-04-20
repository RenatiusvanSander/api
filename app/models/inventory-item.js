/**
 * Config stores every vary for the InventoryItemModel calss
 *
 * @attribute config
 * @readOnly
 * @default true
 * @type String
 */
var config = require('../config/config.json');
/**
 * Sequelize it is an ORM-Object. It writes the changes on the XML-Models
 * to the database
 *
 * @attribute Sequelize
 * @readOnly
 * @default true
 * @type Object
 */
var Sequelize = require('sequelize');
/**
 * is a sequelize ORM-Object
 *
 * @attribute sequelize
 * @default true
 * @type Object
 */
var sequelize = new Sequelize(config.database, config.username, config.password, config.options);
/**
 * is an error object and stores error message
 *
 * @attribute error
 * @default false
 * @type Object
 */
var error; // error message
/**
 * is an instance of the inventoryItemModel Object
 * here are done the operations on the Object Related Mapping
 * and synchronized to database
 *
 * @attribute inventory_items
 * @default true
 * @type Object
 */
var inventory_items; // model of table inventory_item

// ensure proper model
try {
  inventory_items = sequelize.define('inventory_items', {
    inventoryNo: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'inventoryNo',
      field: 'inventoryNo',
      comment: 'Inventory number of an item'
    },
    barcode: {
      type: Sequelize.INTEGER(11).UNSIGNED, //type Integer none negative numbers
      //see http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
      allowNull: false,
      unique: 'barcode', //it has to be only once in database
      field: 'barcode', //field barcode
      comment: 'Barcode exists of positive numbers without characters'
    },
    itemname: {
      type: Sequelize.STRING, //type varchar is STRING
      allowNull: false,
      field: 'itemname', //field itemname in database
      comment: 'Name of the item that is borrowed'
    },
    fixLocation: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'fixLocation',
      comment: 'this is the location of an item'
    },
    borrower: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'borrower', // field: borrower
      comment: 'The person who borrows the inventory-item'
    },
    itemState: {
      type: Sequelize.ENUM,
      allowNull: false,
      field: 'itemState',
      values: [
        'active',
        'deleted'
      ],
      comment: 'Information if the inventory item has been deleted'
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'comment', // fiedl comments for every comment
      comment: 'This field is for comments'
    }
  }, {
    freezeTableName: true //tablename is the same like model
  });
}
catch (error) {
  // could not create table ends in error
  console.log('model(): Model has not been created: ', error);
}

// create table inventory_items
try {
  // do not overwrite if table exists
  inventory_items.sync({force: false});
}
catch (error) {
  // error handler table is not created
  console.log('/api/inventory-item: MySQL hasn\'t created table inventory_items: ', error);
}

module.exports = inventory_items;