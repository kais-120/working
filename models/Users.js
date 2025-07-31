const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Users = sequelize.define("Users",{
  id:{
    type:DataTypes.BIGINT.UNSIGNED,
    autoIncrement:true,
    primaryKey:true,
  },
  name:{
    type:DataTypes.STRING(30),
    allowNull:false,
  },
  last_name:{
    type:DataTypes.STRING(30),
    allowNull:false,
  },
  email:{
    type:DataTypes.STRING(75),
    allowNull:false,
  },
  password:{
    type:DataTypes.STRING(120),
    allowNull:false,
  },
  rule:{
    type:DataTypes.ENUM("client","admin","owner"),
    defaultValue:"client",
    allowNull:false,
  },
  phone:{
    type:DataTypes.STRING(8),
    allowNull:false,
  },
 
},{
  tableName:"users",
}
);

module.exports = Users
