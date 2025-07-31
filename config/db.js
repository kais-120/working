const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('djerba_coworking', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
