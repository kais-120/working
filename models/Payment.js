const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define("Payment",{
    id:{
        type:DataTypes.BIGINT.UNSIGNED,
        autoIncrement:true,
        primaryKey:true,
    },
    booking_id:{
        type:DataTypes.BIGINT.UNSIGNED,
        references:{
            model:"booking",
            key:"id"
        },
        onDelete:"cascade"
    },
    references:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM("pending","accept","refuse"),
        allowNull:false,
        defaultValue:"pending"
    },
    payment_date:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW
    }
},{
    tableName:"payment",
    timestamps:false,
})
module.exports = Payment;