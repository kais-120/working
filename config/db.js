const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username:process.ENV.MYSQLUSER,
  password:process.ENV.MYSQLPASSWORD,
  port:process.ENV.MYSQLPORT,
  host: process.ENV.MYSQLHOST,
  database:process.ENV.MYSQLDATABASE,
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
