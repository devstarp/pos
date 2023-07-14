'use strict';
import policy from '../../config/policy'
import parse from '../../helpers/parse'

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Categories, {
        foreignKey: 'category_id',
        as: 'category',
      });
      Product.belongsTo(models.Employees, {
        foreignKey: 'author_id',
        as: 'author',
      });
      Product.hasMany(models.PurchaseItems, {
        foreignKey: 'product_id',
        as: 'purchases',
      });
      Product.hasMany(models.SaleItems, {
        foreignKey: 'product_id',
        as: 'sales',
      });
    }
  }
  Product.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
      },
      barcode: {
        allowNull: true,
        unique: true,
        type: DataTypes.INTEGER(50),
        validate:{
          isNumeric:{
            args:[10, 15],
            msg:'Barcode is 10-15 digits'
          }
        },
      },
      qrcode: {
        allowNull: true,
        unique: true,
        type: DataTypes.STRING(50),
      },
      product_code: {
        allowNull: true,
        unique: true,
        type: DataTypes.STRING(50),
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(50),
        set (value){
          !this.getDataValue('product_code') &&  this.setDataValue('product_code', parse.generateCode(value))
          !this.getDataValue('qrcode') &&  this.setDataValue('qrcode', parse.generateCode(value))
          this.setDataValue('name', value)
        }
      },
      brand: {
        allowNull: true,
        type: DataTypes.STRING(50),
        validate:{
          len:{
            args:[2], 
            msg: "Length is over 2"
          }
        },
        set (value){
          typeof value ==='string' && this.setDataValue('brand',value.toUpperCase())
        }
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      image: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      total_quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      purchase_price: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue: 0,
        set(value){
          if(!this.getDataValue('sale_price')){
            this.setDataValue('sale_price', value *  policy.net_profit)
            this.setDataValue('sale_currency', this.getDataValue('purchase_currency') )
          }
          this.setDataValue('purchase_price', value)
        }
      },
      purchase_currency: {
        allowNull: true,
        type: DataTypes.ENUM(policy.currencies),
        defaultValue: policy.main_currency,
      },
      sale_price: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue: 0,
        set(value){
          if(!this.getDataValue('purchase_price')){
            this.setDataValue('purchase_price', value * 1 / policy.net_profit)
            this.setDataValue('purchase_currency', this.getDataValue('sale_currency') )
          }
          this.setDataValue('sale_price', value)
        }
      },
      sale_currency: {
        allowNull: true,
        type: DataTypes.ENUM(policy.currencies),
        defaultValue: policy.main_currency,
      },
      category_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      author_id: {
        allowNull: true,
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
    },
    {
      modelName: 'Products',
      tableName: 'products',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    }
  );

  return Product;
};
