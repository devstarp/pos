'use strict';
import policy from '../../config/policy'
import sequelize from 'sequelize';
const { Model } = sequelize;

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.belongsTo(models.Employees, {
        foreignKey: 'leader_id',
        as: 'leader',
      });
      Department.hasMany(models.Employees, {
        foreignKey: 'department_id',
        as: 'members',
      });
    }
  }
  Department.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
      },
      author_id: {
        allowNull: true,
        type: DataTypes.BIGINT(20),
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(50),
        unique: true,
      },
      role:{
        allowNull: false,
        type: DataTypes.ENUM(policy.departments),
      },
      leader_id: {
        allowNull: true,
        type: DataTypes.INTEGER(),
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING(25),
      },
      fax: {
        allowNull: true,
        type: DataTypes.STRING(25),
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING(25),
      },
      address: {
        allowNull: true,
        type: DataTypes.TEXT,
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
      modelName: 'Departments',
      tableName: 'departments',
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

  return Department;
};
