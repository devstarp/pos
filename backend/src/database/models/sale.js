'use strict';
import policy from '../../config/policy'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      Sale.belongsTo(models.Employees, {
        foreignKey: 'author_id',
        as: 'author',
      });
      Sale.belongsTo(models.Customers, {
        foreignKey: 'customer_id',
        as: 'customer',
      });
      Sale.hasMany(models.SaleItems,{
        foreignKey:'sale_id',
        as:'items'
      })
    }
  }
  Sale.init(
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
      modelName: 'Sales',
      tableName: 'Sales',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    }
  );
  return Sale;
};
