'use strict';
import policy from '../../config/policy'
import parse from '../../helpers/parse'

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.belongsTo(models.Employees, {
        foreignKey: 'author_id',
        as: 'author',
      });
      Customer.hasMany(models.Sales, {
        foreignKey: 'customer_id',
        as: 'sales',
      });
      Customer.hasMany(models.SaleItems, {
        foreignKey: 'customer_id',
        as: 'sale_items',
      });
    }
  }
  Customer.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
      },
      author_id: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING(25),
        unique: true,
      },
      mobile_phone: {
        allowNull: true,
        type: DataTypes.STRING(25),
        unique: true,
        set (value) {
          if(!this.getDataValue('name')){
            this.setDataValue('name', value)
          }
          this.setDataValue('mobile_phone', value)
        }
      },
      home_phone: {
        allowNull: true,
        type: DataTypes.STRING(25),
        unique: true,
        set (value) {
          if(!this.getDataValue('name') && !this.getDataValue('mobile_phone')){
            this.setDataValue('name', value)
          }
          this.setDataValue('home_phone', value)
        }
      },
      office_phone: {
        allowNull: true,
        type: DataTypes.STRING(25),
        unique: true,
        set (value) {
          if(!this.getDataValue('name') && !this.getDataValue('mobile_phone') && !this.getDataValue('home_phone')){
            this.setDataValue('name', value)
          }
          this.setDataValue('office_phone', value)
        }
      },
      other_phone: {
        allowNull: true,
        type: DataTypes.STRING(25),
        unique: true,
        set (value) {
          if(!this.getDataValue('name') && !this.getDataValue('mobile_phone') && !this.getDataValue('home_phone') && !this.getDataValue('office_phone')){
            this.setDataValue('name', value)
          }
          this.setDataValue('other_phone', value)
        }
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(50),
        set (value) {
          if(!this.getDataValue('mobile_phone')){
            parse.getNumberIfPositive(value) && this.setDataValue('mobile_phone', parse.getNumberIfPositive(value))
          }
          this.setDataValue('name', value)
        }
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
      address: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      payment_type: {
        allowNull: false,
        type: DataTypes.ENUM(policy.payment_type),
        defaultValue: policy.default_payment_type,
      },
    },
    {
      modelName: 'Customers',
      tableName: 'Customers',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    }
  );

  return Customer;
};
