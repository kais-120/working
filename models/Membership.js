const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Membership = sequelize.define("Membership",{
    id:{
        type:DataTypes.BIGINT.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING(30),
        allowNull:false,
    },
    price_day:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false,
     },
    price_month:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false,
     },
    
},{
    tableName:"membership"
});
module.exports = Membership;