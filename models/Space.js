const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Space = sequelize.define("Space",{
  id:{
    type:DataTypes.BIGINT.UNSIGNED,
    autoIncrement:true,
    primaryKey:true,
  },
  title:{
    type:DataTypes.STRING(30),
    allowNull:false,
  },
  location:{
    type:DataTypes.STRING(50),
    allowNull:false,
  },
  description:{
    type:DataTypes.TEXT,
    allowNull:false,
  },
  image:{
    type:DataTypes.STRING(150),
    allowNull:false,
  },
},{
  tableName:"spaces",
}
);
module.exports = Space


