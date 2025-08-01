const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username:process.env.MYSQLUSER,
  password:process.env.MYSQLPASSWORD,
  port:process.env.MYSQLPORT,
  host: process.env.MYSQLHOST,
  database:process.env.MYSQLDATABASE,
   dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
