import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import config from '../config'

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const CONFIG = config[env];

const db = {};

const sequelize = new Sequelize(CONFIG.database, CONFIG.username, CONFIG.password, CONFIG);

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db
