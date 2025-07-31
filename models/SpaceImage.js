const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SpaceImage = sequelize.define("SpaceImage",{
    id:{
        type:DataTypes.BIGINT.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
    },
    space_id:{
        type:DataTypes.BIGINT.UNSIGNED,
        references:{
            model:"spaces",
            key:"id"
        },
        onDelete:"cascade"
    },
    image_url:{
        type:DataTypes.STRING(100),
        allowNull:false
    }
},{
    tableName:"space_images"
})
module.exports = SpaceImage;