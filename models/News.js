const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const News = sequelize.define("News",{
    id:{
        type:DataTypes.BIGINT.UNSIGNED,
        primaryKey:true,
        autoIncrement:true,
    },
    status:{
        type:DataTypes.ENUM("publish","unpublish"),
        allowNull:false,
    },
    category:{
        type:DataTypes.ENUM("nouveautés","services","événements","maintenance","promotions"),
        allowNull:false,
    },
    content:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    titre:{
        type:DataTypes.STRING(150),
        allowNull:false,
    },
    image:{
        type:DataTypes.STRING(150),
        allowNull:false,
    },
    date_start:{
        type:DataTypes.DATEONLY,
        allowNull:true,
    },
    date_end:{
        type:DataTypes.DATEONLY,
        allowNull:true,
    },
    time_start:{
        type:DataTypes.TIME,
        allowNull:true,
    }
},{
    tableName:"news"
});
module.exports = News;