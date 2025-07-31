const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Users = require("./Users");

const Review = sequelize.define("Review",{
    id:{
        type:DataTypes.BIGINT.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
    },
    review:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    rating:{
        type:DataTypes.INTEGER.UNSIGNED,
        allowNull:false,
     },
    position:{
        type:DataTypes.STRING(30),
        allowNull:false,
     },
     status:{
       type:DataTypes.ENUM("pending","refuse","accept"),
       allowNull:false,
       defaultValue:"pending"
     },
     user_id:{
       type:DataTypes.BIGINT.UNSIGNED,
       allowNull:false,
       references:{
        model:Users,
        key:"id"
       },
       onDelete:"cascade"
     },
},{
    tableName:"reviews"
});
module.exports = Review;