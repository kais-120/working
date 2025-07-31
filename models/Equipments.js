const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Equipments = sequelize.define("Equipments",{
    id:{
        type:DataTypes.BIGINT.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
      },
      equipment:{
        type:DataTypes.STRING(120),
        allowNull:false,
      },
},{
    tableName:"equipments"
});
module.exports = Equipments;