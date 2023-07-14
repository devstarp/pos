'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    static associate(models) {
      // PurchaseItem.belongsTo(models.Orders, {
      //   foreignKey: 'purchase_id',
      //   as: 'purchase',
      // });
      // OrderDetail.belongsTo(models.Products, {
      //   foreignKey: 'product_id',
      //   as: 'product',
      // });
      // OrderDetail.belongsTo(models.Uoms, {
      //   foreignKey: 'uom_id',
      //   as: 'uom',
      // });
      // OrderDetail.belongsTo(models.Varieties, {
      //   foreignKey: 'variety_id',
      //   as: 'variety',
      // });
    }
  }
  Currency.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
      },
      name: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'name',
      },
      sale_price: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        field: 'sale_price',
      },
      basic_currency:{
        allowNull: false,
        type: DataTypes.BIGINT(20),
        field: 'basic_currency',
      },
      purchase_price: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        field: 'purchase_price',
      },
      available: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        field: 'available',
      },
      new: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        field: 'new',
      },
      editable: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        field: 'editable',
      },
      created_at: {
        allowNull: false,
        defaultValue: new Date(Date.now()),
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updated_at: {
        allowNull: false,
        defaultValue: new Date(Date.now()),
        type: DataTypes.DATE,
        field: 'updated_at',
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      modelName: 'Currencies',
      tableName: 'currencies',
      underscored: true,
      freezeTableName: true,
    }
  );

  return Currency;
};
