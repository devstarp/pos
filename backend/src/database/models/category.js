'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Products, {
        foreignKey: 'category_id',
        as: 'products',
      });
      Category.belongsTo(models.Employees, {
        foreignKey: 'author_id',
        as: 'author',
      });
    }
  }
  Category.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT(20),
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(50),
        validate:{
          notEmpty:{
            msg:'The field cannot be empty'
          },
        }
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      author_id: {
        allowNull: true,
        type: DataTypes.BIGINT(20),
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
        field: 'editable',
      },
      enabled: {
        type: DataTypes.VIRTUAL,
        get() {
          return !this.deleted_at;
        },
      },
    },
    {
      modelName: 'Categories',
      tableName: 'categories',
      sequelize,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    }
  );

  return Category;
};
