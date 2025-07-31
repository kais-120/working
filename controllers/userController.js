const { body, validationResult } = require("express-validator");
const Users = require("../models/Users");
const bcryptjs = require("bcryptjs");
const { Op } = require("sequelize");


exports.users = 
  async (req, res) => {
    const {page} = req.params;
    const offset = ((page - 1) * 7)
    try {
      const users = await Users.findAndCountAll({
        limit:7,
        offset:offset,
        attributes:{
          exclude:"password"
        }
      });
      const totalPage = Math.ceil(users.count / 7)
      res.send({users,page,totalPage});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  exports.deleteUser = async(req,res)=>{
  const {id} = req.params;
    try{
      const user = await Users.findByPk(id);
      if(!user){
        return res.status(404).send({message:"user not found"})
      }
      user.destroy();
      return res.send({message:"user is deleted"})
    }catch{
      return res.status(500).send({message:"server error"})
    }
}
  exports.getUserById = async(req,res)=>{
    const {id} = req.params;
    try{
      const user = await Users.findByPk(id);
      if(!user){
        return res.status(404).send({message:"user not found"})
      }
      return res.send(user)
    }catch{
      return res.status(500).send({message:"server error"})
    }
}
exports.addOwner = [
   body("name").notEmpty().withMessage("name is required"),
  body("last_name").notEmpty().withMessage("last name is required"),
  body("email").notEmpty().withMessage("email is required")
  .isEmail().withMessage("the filed should be email"),
  body("password").notEmpty().withMessage("name is required"),
  body("phone").notEmpty().withMessage("phone is required"),
  async (req,res) => {
  const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array().map(err => err.msg) });
    }
    try {
      const { name, last_name, email, password, phone } = req.body;
      const existingUser = await Users.findOne({where: {email} });
      if (existingUser) {
        return res.status(422).json({ msg: "email is already used" });
      }
      const hashed = await bcryptjs.hash(password, 10);
    Users.create({ name,last_name, email, password: hashed,phone,rule:"owner" });
      res.status(201).json({ msg: "Owner are Added" });
    } catch (err) {
      res.status(500).json({ msg: "server error" });
      console.log(err)
    }
  }
];
exports.searchUser = async (req, res) => {
  const { name } = req.query;
  const { page } = req.params;
  const fullName = name.split(" ");
  const offset = (page - 1) * 7;
  try {
    const users = await Users.findAndCountAll({
      attributes:{
        exclude:'password'
      },
      limit:7,
      offset,
     where: {
      [Op.and]: [
        {
          name: {
            [Op.like]: `%${fullName[0]}%`
          }
        },
        ...(fullName[1] ? [{
          last_name: {
            [Op.like]: `%${fullName[1]}%`
          }
        }] : [])
      ]
    }
    });
    const totalPage = Math.ceil(users.count / 7)

    return res.send({users,page,totalPage});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};
