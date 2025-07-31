const { body, validationResult } = require("express-validator");
const { Users, Payment } = require("../models");
const Booking = require("../models/Booking");
const CustomMembership = require("../models/CustomMembership");
const MembershipEquipments = require("../models/MembershipEquipments");
const { Op } = require("sequelize");


// Créer une réservation
exports.createBooking = [
  body("date_start").notEmpty().withMessage("date start required"),
  body("time_start").notEmpty().withMessage("time start required"),
  body("duration").notEmpty().withMessage("duration required"),
  body("membership").notEmpty().withMessage("membership required"),
  body("price").notEmpty().withMessage("price required")
  .isInt().withMessage("price should be integer")
  ,
  async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
      return res.status(422).send({message:error.array().map(err => err.msg)})
    }
    const { membership,date_start,time_start,duration,price } = req.body;
    const user_id = req.userId
    console.log(membership)
    try {
      Booking.create({
        user_id,
        date_start,
        time_start,
        duration,
        membership,
        price
      });

      
      res.send({ msg: "Réservation créée" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
];
exports.createBookingCustom = [
  body("date_start").notEmpty().withMessage("date start required"),
  body("time_start").notEmpty().withMessage("time start required"),
  body("duration").notEmpty().withMessage("duration required"),
  body("membership").notEmpty().withMessage("membership required"),
  body("equipment").notEmpty().withMessage("equipment required"),
  body("availability").notEmpty().withMessage("availability required"),
  body("offered").notEmpty().withMessage("Offered required"),
  body("access_meeting").notEmpty().withMessage("access meeting required"),
  body("invitation").notEmpty().withMessage("Invitation required"),
  body("access").notEmpty().withMessage("access required")
  ,
  async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
      return res.status(422).send({message:error.array().map(err => err.msg)})
    }
    const { membership,date_start,time_start,duration,price,equipment,availability,offered,access_meeting,invitation,access,mailAlert,offshoreCreation } = req.body;
    const user_id = req.userId
    let offeredString = ""
    for(let i = 0; i < offered.length; i++){
      offeredString += offered[i] + "/"
    }
    offeredString = offeredString.slice(0,-1);
    try {
      const booking = await Booking.create({
        user_id,
        date_start,
        time_start,
        duration,
        membership,
        price
      });
      console.log(offeredString)
      const customMembership = await CustomMembership.create({
        availability,offered:offeredString,access_meeting,invitation,access,offshoreCreation,mailAlert,booking_id:booking.id
      });
      console.log(customMembership.id)
      for (const item of equipment) {
        await MembershipEquipments.create({
         custom_membership_id:customMembership.id,
         equipment:item
      });

      }
      
      res.send({ msg: "Réservation créée" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
      console.log(err)
    }
  }
];

exports.getMyBookings = async (req, res) => {
  const id = req.userId
  try {
    const bookings = await Booking.find({where: {user_id: id} })
    res.send(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.getAllBookings = async (req, res) => {
  const {page} = req.params;
  try {
    const offset = (page - 1) * 7;
    const bookings = await Booking.findAndCountAll({
      limit:7,
      distinct:true,
      offset,
      order:[["createdAt","DESC"]],
      include:
        [{
          model:Users,
          as:"users",
          attributes:["id",'name','last_name',"email","phone"]
        },
        {
          model:Payment,
          as:"paymentBooking",
          attributes:["id","references","payment_date"]
        },
        {
          model:CustomMembership,
          as:"CustomMembership",
          attributes:["id","offered","access_meeting","invitation","access","offshoreCreation","mailAlert"],
          include:{
            model:MembershipEquipments,
            as:"MembershipEquipments",
            attributes:["id","equipment"]
          }
        },
      ]
      
    });
    const totalPage = Math.ceil(bookings.count / 7)
    res.json({bookings,totalPage,page});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.UpdateBookingStatus = 
[
  body("status").notEmpty().withMessage("status required"),
  body("membership").notEmpty().withMessage("membership required"),
 body("price").custom((value, { req }) => {
  if (req.body.membership === "personnalisé" && (!value || isNaN(value))) {
    throw new Error("Le prix est requis et doit être un nombre pour un abonnement personnalisé");
  }
  return true;
})
  ,async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
      return res.status(422).send({message:error.array()[0].msg})
    }
  const {id} = req.params;
  const {status,membership,price} = req.body
  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ msg: "Réservation non trouvée" });
    }
    booking.status = status;
    if(status === "accept"){
      booking.payment_access = "pending"
    }
    if(membership === "personnalisé"){
      booking.price = price;
    }
    booking.save();

    res.json({ msg: "Réservation est mettre a jour" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
];
exports.getBookingByUser = async (req,res) =>{
  const user_id = req.userId;
  const {page} = req.params;
  const date = new Date()
  try{
    const offset = (page - 1) * 7;
    const bookings = await Booking.findAndCountAll({
      include:[
        {
          model:Payment,
          as:"paymentBooking",
          attributes:["references"]
        }
      ],
      limit:7,
      offset,
      where: {
        user_id
      }
    });
    const totalPage = Math.ceil(bookings.count / 7)
    res.json({bookings,totalPage,page});
  }catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
exports.searchReference = async(req,res)=>{
  const { ref } = req.query;
  const { page } = req.params;
  const offset = (page - 1) * 7;
  const bookings = await Booking.findAndCountAll({
    limit:7,
    offset,
    include:[{
    model:Payment,
    as:"paymentBooking",
    attributes:["id","references","status","payment_date","amount"],
     where:{
      [Op.and]:{
        references:{
          [Op.like]:`%${ref}%`
        },
        status:{
          [Op.eq]:"accept"
        }
      }
  }
  },
  {
    model:Users,
    as:"users",
    attributes:["id","name","last_name","email","phone"]
  }
],
})
const totalPage = Math.ceil(bookings.count / 7)
  res.send({bookings,page,totalPage})
}
