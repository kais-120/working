const Booking = require("./Booking");
const CustomMembership = require("./CustomMembership");
const MembershipEquipments = require("./MembershipEquipments");
const Payment = require("./Payment");
const Review = require("./Review");
const Users = require("./Users");

Users.hasMany(Booking,{
    foreignKey:"user_id",
    as:"booking",
    onDelete:"cascade"
});
Booking.belongsTo(Users,{
     foreignKey:"user_id",
    as:"users",
    onDelete:"cascade"
});
Booking.hasMany(Payment,{
    foreignKey:"booking_id",
    as:"paymentBooking",
    onDelete:"SET NULL"
});
Payment.belongsTo(Booking,{
    foreignKey:"booking_id",
    as:"bookingPayment",
    onDelete:"SET NULL"
});
Users.hasMany(Review,{
    foreignKey:"user_id",
    as:"reviewUser",
    onDelete:"cascade"
});
Review.belongsTo(Users,{
    foreignKey:"user_id",
    as:"userReviews",
    onDelete:"cascade"
});
Booking.hasMany(CustomMembership,{
    foreignKey:"booking_id",
    as:"CustomMembership",
    onDelete:"cascade"
})
CustomMembership.belongsTo(Booking,{
    foreignKey:"booking_id",
    as:"BookingCustomMembership",
    onDelete:"cascade"
})
CustomMembership.hasMany(MembershipEquipments,{
    foreignKey:"custom_membership_id",
    as:"MembershipEquipments",
    onDelete:"cascade"
})
MembershipEquipments.belongsTo(CustomMembership,{
    foreignKey:"custom_membership_id",
    as:"EquipmentsMembership",
    onDelete:"cascade"
})

module.exports = {Booking,Users,Payment,Review,CustomMembership,MembershipEquipments}