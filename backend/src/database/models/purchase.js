'use strict';
import policy from '../../config/policy'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    static associate(models) {
      Purchase.belongsTo(models.Employees, {
        foreignKey: 'author_id',
        as: 'author',
      });
      Purchase.belongsTo(models.Suppliers, {
        foreignKey: 'supplier_id',
        as: 'supplier',
      });
      Purchase.hasMany(models.PurchaseItems,{
        foreignKey:'purchase_id',
        as:'items'
      })
    }
  }
  Purchase.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
        unique: true,
      },
      order_number: {
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      author_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      supplier_id: {
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
      comment: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      total_amount: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue:0,
        set(value){
          if(!this.subtotal_amount){
            this.setDataValue('subtotal_amount', value)
          }
          this.setDataValue('total_amount', value)
        }
      },
      subtotal_amount: {
        allowNull: false,
        type: DataTypes.DECIMAL(25, 2),
        defaultValue:0,
        set(value){
          if(!this.total_amount){
            this.setDataValue('total_amount', value)
          }
          this.setDataValue('subtotal_amount', value)
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
      modelName: 'Purchases',
      tableName: 'purchases',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    }
  );
  return Purchase;
};
