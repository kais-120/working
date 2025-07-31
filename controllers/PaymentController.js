const { default: axios } = require("axios")
const { body, validationResult } = require("express-validator");
const { Payment, Booking, Users } = require("../models");


exports.CreatePayment = [
    body("amount").notEmpty().withMessage("amount is required")
    .isInt().withMessage("amount should be integer"),
    body("booking_id").notEmpty().withMessage("booking id is required")
    .isInt().withMessage("booking id should be integer"),
    async(req,res)=>{
        const error = validationResult(req);
            if(!error.isEmpty()){
              return res.status(422).send({message:error.array().map(err => err.msg)})
            }
    let { amount,booking_id } = req.body
    amount *= 1000
    try{
        const response = await axios.post("https://api.sandbox.konnect.network/api/v2/payments/init-payment",{
                receiverWalletId:process.env.KONNECT_WALLET_ID,
                amount,
                acceptedPaymentMethods: ["bank_card", "e-DINAR","konnect"],
                successUrl:"http://localhost:8080/payment/success",
                failUrl:"http://localhost:8080/payment/fail",
            },
            { 
                headers:{
                    "x-api-key":process.env.KONNECT_API_KEY,
                }
        }
    )
    Payment.create({booking_id,references:response.data.paymentRef,amount})
    res.send(response.data)

    }catch(err){
        console.log(err)
        return res.status(500).send({message:err})
    }
}
]
exports.VerifyPayment = [
    body("payment_id").notEmpty().withMessage("payment id is required"),
    async(req,res)=>{
        const error = validationResult(req);
            if(!error.isEmpty()){
              return res.status(422).send({message:error.array().map(err => err.message)})
            }
    const { payment_id } = req.body
    try{
        const paymentSchema = await Payment.findOne({where: {references:payment_id}})
        const booking = await Booking.findByPk(paymentSchema.booking_id)
        const response = await axios.get(`https://api.sandbox.konnect.network/api/v2/payments/${payment_id}`)
        const payment = response.data.payment;
        if(payment.failedTransactions === 1){
            paymentSchema.status = "refuse"
            return res.status(402).send("payment not valid")
        }
        else if(payment.successfulTransactions === 1){
            paymentSchema.status = "accept";
            booking.payment_access = "accept";
            booking.save();
        }
        paymentSchema.save()

    res.send({message:"payment updated",data:payment});

    }catch(err){
        console.log(err)
        return res.status(500).send({message:err})
    }
}
];
exports.paymentVerifyAdmin = [
    body("references").notEmpty().withMessage("reference is required"),
    async (req,res) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(422).send({message:error})
        }
        const { references } = req.body;
        try{   
            const payment = await Payment.findAll({where: {references},
            include:[{
                model:Booking,
                as:"bookingPayment",
                attributes:["id","membership","date_start","time_start","duration","number_person","createdAt"],
                include:{
                    model:Users,
                    as:"users",
                    attributes:["id","name","last_name","email","phone"]
                }
            }]
            });
            if(payment.length < 1){
                return res.status(404).send({message:"payment not found"})
            }
                return res.send(payment)
        }
        catch(err){
            console.log(err)
            return res.status(500).send({message:"server error"})
        }
    }
]
