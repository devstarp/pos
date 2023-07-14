'use strict';
import policy from '../../config/policy'
import parse from '../../helpers/parse'

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SaleItem extends Model {
    static associate(models) {
      SaleItem.belongsTo(models.Employees, {
        foreignKey: 'author_id',
        as: 'author',
      });
      SaleItem.belongsTo(models.Sales, {
        foreignKey: 'sale_id',
        as: 'sale',
      });
      SaleItem.belongsTo(models.Customers, {
        foreignKey: 'customer_id',
        as: 'customer',
      });
      SaleItem.belongsTo(models.Products, {
        foreignKey: 'product_id',
        as: 'product',
      });
      SaleItem.hasMany(models.SalePurchaseItems, {
        foreignKey: 'sale_item_id',
        as: 'sale_purchase_items',
      });
      SaleItem.belongsToMany(models.PurchaseItems, {
        through: models.SalePurchaseItems,
        foreignKey:'sale_item_id',
        as: 'purchase_items'
      })
    }
  }
  SaleItem.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
      },
      sale_id: {
        allowNull: false,
        type: DataTypes.BIGINT(20),
      },
      author_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      product_id: {
        allowNull: false,
        type: DataTypes.BIGINT(20),
      },
      customer_id: {
        allowNull: false,
        type: DataTypes.BIGINT(20),
      },
      quantity: {
        allowNull: false,
        type: DataTypes.BIGINT(20),
        defaultValue:0,
        set (value){
          let total = 0;
          if(parse.getNumberIfPositive(this.price)){
            total = parse.getNumberIfPositive(this.price) *  parse.getNumberIfPositive(value)
          }
          this.setDataValue('total', total)
          this.setDataValue('quantity', value)
          if(!this.remained_quantity){
            this.setDataValue('remained_quantity', value)
          }
        }
      },
      price: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue:0,
        set (value){
          let total = 0;
          if(parse.getNumberIfPositive(this.quantity)){
            total = parse.getNumberIfPositive(this.quantity) *  parse.getNumberIfPositive(value)
          }
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
    },
    {
      modelName: 'SaleItems',
      tableName: 'Sale_items',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    }
  );

  return SaleItem;
};
