'use strict';
import policy from '../../config/policy'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      Invoice.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Invoice.belongsTo(models.Suppliers, {
        foreignKey: 'supplier_id',
        as: 'supplier',
      });
      Invoice.hasMany(models.PurchaseItems,{
        foreignKey:'purchase_id',
        as:'items'
      })
    }
  }
  Invoice.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
        unique: true,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      supplier_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      customer_id: {
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
      comment: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      total_amount: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue:0,
        set(value){
          this.setDataValue('total_amount', value || this.subtotal_amount)
        }
      },
      subtotal_amount: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue:0,
        set(value){
          this.setDataValue('subtotal_amount', value || this.total_amount)
        }
      },
      currency: {
        allowNull: false,
        type: DataTypes.ENUM(policy.currencies),
        defaultValue: policy.main_currency,
      },
      payment_type: {
        allowNull: false,
        type: DataTypes.ENUM(policy.payment_type),
        defaultValue: policy.default_payment_type,
      },
    },
    {
      modelName: 'Invoices',
      tableName: 'invoices',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    }
  );
  return Invoice;
};
