const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username:process.env.MYSQLUSER,
  password:process.env.MYSQLPASSWORD,
  port:process.env.MYSQLPORT,
  host: process.env.MYSQLHOST,
  database:process.env.MYSQLDATABASE,
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
