const env = require('../config/env');

const define = {
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};

module.exports = {
  development: {
    username:env.username,
    password:env.password,
    database:env.database,
    host:env.host,
    dialect:env.dialect,
    dialectOptions:{decimalNumbers:true},
    define,
    timezone: '+07:00',
    logging: (query, options, time) => {
      console.log(query);
    },
  },
};
