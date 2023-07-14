'use strict';
import policy from '../../config/policy'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      Employee.belongsTo(models.Employees, {
        foreignKey: 'author_id',
        as: 'author',
      });
      Employee.belongsTo(models.Departments, {
        foreignKey: 'department_id',
        as: 'department',
      });
      Employee.hasMany(models.Departments, {
        foreignKey: 'leader_id',
        as: 'leader',
      });
      Employee.hasMany(models.Products, {
        foreignKey: 'author_id',
        as: 'products',
      });
      Employee.hasMany(models.Categories, {
        foreignKey: 'author_id',
        as: 'categories',
      });
    }
  }
  Employee.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
      },
      department_id: {
        allowNull: false,
        type: DataTypes.BIGINT(20),
      },
      author_id: {
        allowNull: true,
        type: DataTypes.BIGINT(20),
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      username: {
        allowNull: true,
        type: DataTypes.STRING(50),
        unique: true,
      },
      first_name: {
        allowNull: false,
        type: DataTypes.STRING(15),
      },
      last_name: {
        allowNull: false,
        type: DataTypes.STRING(15),
      },
      full_name: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.first_name} ${this.last_name}`;
        },
      },
      position: {
        allowNull: false,
        type: DataTypes.ENUM(policy.positions),
        defaultValue: policy.default_position,
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING(25),
        unique: true,
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING(25),
        unique: true,
      },
      address: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      birth_date: {
        allowNull: true,
        type: DataTypes.DATE,
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
      enabled: {
        type: DataTypes.VIRTUAL,
        get() {
          return !this.deleted_at;
        },
      },
      last_login: {
        allowNull: true,
        defaultValue: new Date(Date.now()),
        type: DataTypes.DATE,
      },
    },
    {
      modelName: 'Employees',
      tableName: 'employees',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    }
  );
  return Employee;
};
