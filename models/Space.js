const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Space = sequelize.define("Space",{
  id:{
    type:DataTypes.BIGINT.UNSIGNED,
    autoIncrement:true,
    primaryKey:true,
  },
  name:{
    type:DataTypes.STRING(30),
    allowNull:false,
  },
  capacity:{
    type:DataTypes.INTEGER.UNSIGNED,
    allowNull:false,
  },
  available:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
  },
  price:{
    type:DataTypes.DOUBLE.UNSIGNED,
    allowNull:false,
  },
  description:{
    type:DataTypes.TEXT,
    allowNull:false,
  },
},{
  tableName:"spaces",
}
);
module.exports = Space


