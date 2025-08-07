const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
exports.register = [
  body("name").notEmpty().withMessage("name is required"),
  body("last_name").notEmpty().withMessage("last name is required"),
  body("email").notEmpty().withMessage("email is required")
  .isEmail().withMessage("the filed should be email"),
  body("password").notEmpty().withMessage("name is required"),
  body("phone").notEmpty().withMessage("phone is required")
  ,async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array().map(err => err.msg) });
    }
    try {
      const { name, last_name, email, password, phone } = req.body;
      const existingUser = await User.findOne({where: {email} });
      if (existingUser) {
        return res.status(422).json({ msg: "email is already used" });
      }
      const hashed = await bcrypt.hash(password, 10);
    User.create({ name,last_name, email, password: hashed,phone });
      res.status(201).json({ msg: "User registered" });
    } catch (err) {
      res.status(500).json({ msg: "server error" });
    }
  }
];

exports.login = [
   body("email").notEmpty().withMessage("email is required"),
  body("password").notEmpty().withMessage("name is required"),
  body("remember").notEmpty().withMessage("remember is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array().map(err => err.msg) });
    }
  const { email, password,remember } = req.body;
  try {
    const user = await User.findOne({where: {email} });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ sub: user.id,iss:"wwww.djerbacoworking.com",aud:"Djerba Coworking" }, process.env.JWT_SECRET ,{expiresIn: !remember ? "24h" : "7d"});
    res.send({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
];

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId,{
      attributes:{
        exclude:"password"
      }
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.send(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateProfile = [
  body("name").notEmpty().withMessage("name is required"),
  body("last_name").notEmpty().withMessage("last name is required"),
  body("phone").notEmpty().withMessage("phone is required")
  ,async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array().map(err => err.msg) });
    }
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const { name, last_name, phone } = req.body;

    user.name = name;
    user.last_name = last_name;
    user.phone = phone;
    await user.save();
    res.json({ message: "Profil mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
    console.log(err)
  }
}
];
exports.updateEmail = [
  body("password").notEmpty().withMessage("password is required"),
  body("email").notEmpty().withMessage("email is required")
  ,async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array().map(err => err.msg) });
    }
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    
    const { password, email } = req.body;
    if(await bcrypt.compare(password,user.password,)){
      if(email === user.email){
          res.status(400).send({ message: "The Email is the same as the old" });
      }
    const users = await User.findAll({where: {email}}) 
        if(users.length === 0){
          user.email = email;
          await user.save();
          return res.json({ message: "Email Updated" });
        }
        return res.status(422).send({ message: "The Email used" });
    }
    res.status(401).send({ message: "Password Wrong" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
    console.log(err)
  }
}
];
exports.updatePassword = [
  body("current_password").notEmpty().withMessage("current password is required"),
  body("password").notEmpty().withMessage("password is required")
  ,async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array().map(err => err.msg) });
    }
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const { password, current_password } = req.body;
    if(await bcrypt.compare(current_password,user.password)){
      if(await bcrypt.compare(password,user.password)){
        return res.status(400).send({ message: "Password is same of the old" });
      }
      const hastPassword = await bcrypt.hash(password,10)
      user.password = hastPassword;
      await user.save();
      return res.send({ message: "Password is updated with success" });
    }
    return res.status(401).send({ message: "Password Wrong" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
    console.log(err)
  }
}
];
