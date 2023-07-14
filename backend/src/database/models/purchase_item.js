'use strict';
import policy from '../../config/policy'
import parse from '../../helpers/parse'

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PurchaseItem extends Model {
    static associate(models) {
      PurchaseItem.belongsTo(models.Purchases, {
        foreignKey: 'purchase_id',
        as: 'purchase',
      });
      PurchaseItem.belongsTo(models.Products, {
        foreignKey: 'product_id',
        as: 'product',
      });
      PurchaseItem.belongsTo(models.Employees, {
        foreignKey: 'author_id',
        as: 'author',
      });
      PurchaseItem.belongsTo(models.Suppliers, {
        foreignKey: 'supplier_id',
        as: 'supplier',
      });
      PurchaseItem.hasMany(models.SalePurchaseItems, {
        foreignKey: 'purchase_item_id',
        as: 'sale_purchase_items',
      });
      PurchaseItem.belongsToMany(models.SaleItems, {
        through: models.SalePurchaseItems,
        foreignKey:'purchase_item_id',
        as: 'sale_items'
      })
    }
  }
  PurchaseItem.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
      },
      purchase_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      product_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      supplier_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      author_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      new: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      editable: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      enabled: {
        type: DataTypes.VIRTUAL,
        get() {
          return !this.deleted_at;
        },
      },
      remained_quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue:0,
      },
      quantity: {
        allowNull: true,
        type: DataTypes.INTEGER,
        defaultValue:0,
        set (value){
          let total = 0;
          if(parse.getNumberIfValid(this.price)){
            total = parse.getNumberIfValid(this.price) *  parse.getNumberIfValid(value)
          }
          console.log('set quantity---', total)
          this.setDataValue('total', total)
          this.setDataValue('quantity', value)
          if(!this.remained_quantity){
            this.setDataValue('remained_quantity', value)
          }
        }
      },
      price: {
        allowNull: true,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue:0,
        set (value){
          let total = 0;
          if(parse.getNumberIfValid(this.quantity)){
            total = parse.getNumberIfValid(this.quantity) *  parse.getNumberIfValid(value)
          }
          console.log('set price---', total)
          this.setDataValue('total', total)
          this.setDataValue('price', value)
        }
      },
      paid_currency: {
        allowNull: false,
        type: DataTypes.ENUM(policy.currencies),
        defaultValue: policy.main_currency,
      },
      currency: {
        allowNull: false,
        type: DataTypes.ENUM(policy.currencies),
        defaultValue: policy.main_currency,
        set (value){
          if(!this.paid_currency){
            this.setDataValue('paid_currency', value)
          }
          this.setDataValue('currency', value)
        }
      },
      currency_rate: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue: 1,
      },
      total: {
        allowNull: true,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue: 0
      },
    },
    {
      modelName: 'PurchaseItems',
      tableName: 'purchase_items',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    }
  );

  return PurchaseItem;
};
