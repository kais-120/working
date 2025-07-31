const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Booking = require("./Booking");

const CustomMembership = sequelize.define("CustomMembership",{
     id:{
        type:DataTypes.BIGINT.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
      },
      booking_id:{
        type:DataTypes.BIGINT.UNSIGNED,
        allowNull:false,
        references:{
          model:Booking,
          key:"id",
        },
        onDelete:"cascade"
      },
      availability:{
        type:DataTypes.STRING,
        allowNull:false,
      },
      offered:{
        type:DataTypes.STRING,
        allowNull:true,
      },
      access_meeting:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
      },
      invitation:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
      },
      mailAlert:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
      },
      offshoreCreation:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
      },
      access:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
      },
      
},{
    tableName:"custom_membership"
})
module.exports = CustomMembership;