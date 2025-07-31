const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const CustomMembership = require("./CustomMembership");

const MembershipEquipments = sequelize.define("MembershipEquipments",{
    id:{
        type:DataTypes.BIGINT.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
    },
    custom_membership_id:{
        type:DataTypes.BIGINT.UNSIGNED,
        references:{
            model:CustomMembership,
            key:"id"
        },
        onDelete:"cascade"
    },
    equipment:{
        type:DataTypes.STRING,
    },
},{
    tableName:"membership_equipments",
})
module.exports = MembershipEquipments;