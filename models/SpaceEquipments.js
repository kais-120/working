const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Space = require("./Space");
const Equipments = require("./Equipments");

const SpaceEquipments = sequelize.define("SpaceEquipments",{
    id:{
        type:DataTypes.BIGINT.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
    },
    space_id:{
        type:DataTypes.BIGINT.UNSIGNED,
        references:{
            model:Space,
            key:"id"
        },
        onDelete:"cascade"
    },
    equipment_id:{
        type:DataTypes.BIGINT.UNSIGNED,
        references:{
            model:Equipments,
            key:"id"
        },
        onDelete:"cascade"
    },
   
},{
    tableName:"space_equipments",
})
module.exports = SpaceEquipments;