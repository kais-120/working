const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Booking = sequelize.define("Booking",{
  id:{
    type:DataTypes.BIGINT.UNSIGNED,
    autoIncrement:true,
    primaryKey:true,
  },
  user_id:{
    type:DataTypes.BIGINT.UNSIGNED,
    allowNull:false,
    references:{
      model:"users",
      key:"id",
    },
    onDelete:"cascade"
  },
   membership:{
    type:DataTypes.ENUM("Abonné","Privatif","Nomade","personnalisé"),
    allowNull:true,
  },
   duration:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  status:{
    type:DataTypes.ENUM("pending","refuse","accept"),
    allowNull:false,
    defaultValue:"pending"
  },
  date_start:{
      type:DataTypes.DATEONLY,
      allowNull:false,
  },
  price:{
      type:DataTypes.INTEGER,
      allowNull:true,
  },
  time_start:{
      type:DataTypes.TIME,
      allowNull:false,
    },
  number_person:{
      type:DataTypes.INTEGER.UNSIGNED,
      allowNull:true,
    },
    payment_access:{
      type:DataTypes.ENUM("pending","accept"),
      allowNull:true

    }
},{
  tableName:"booking",
}
);


module.exports = Booking;