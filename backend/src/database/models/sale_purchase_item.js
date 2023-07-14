'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SalePurchaseItem extends Model {
    static associate(models) {
      SalePurchaseItem.belongsTo(models.SaleItems, {
        foreignKey: 'sale_item_id',
        as: 'sale_item',
      });
      SalePurchaseItem.belongsTo(models.PurchaseItems, {
        foreignKey: 'purchase_item_id',
        as: 'purchase_item',
      });
    }
  }
  SalePurchaseItem.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
      },
      purchase_item_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      sale_item_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      selfGranted: DataTypes.BOOLEAN
    },
    {
      modelName: 'SalePurchaseItems',
      tableName: 'sale_purchase_items',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    }
  );

  return SalePurchaseItem;
};
