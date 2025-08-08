const { body, validationResult } = require("express-validator");
const Space = require("../models/Space");
const fs = require('fs')

exports.createSpace = [
  body("title").notEmpty().withMessage("name is required"),
  body("location").notEmpty().withMessage("capacity is required"),
  body("description").notEmpty().withMessage("description is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).send({message:errors.array().map((err)=>err.msg)})
    }
    const image = req.files.image;
    if(!image){
      return res.status(422).send({message:"image required"});
    }
    const { title,location,description } = req.body;
    try {
      await Space.create({
        title,
        location,
        description,
        image:image[0].filename
      });
      res.status(201).send({ message: "space is created" });
    } catch (err) {
      res.status(500).send({ msg: err.message });
    }
  },
];

exports.getSpaces = async (req, res) => {
  const { page } = req.params;
  const offset = (page - 1) * 6;
    try {
      const spaces = await Space.findAndCountAll({
        limit:6,
        offset,
        order:[["updatedAt","DESC"]]
      });
      if(!spaces){
        res.status(404).send({err:"there are not a available spaces"});
      }
      const totalPage = Math.ceil(spaces.count/6)
      res.send({spaces,page,totalPage});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getSpaceById = async (req, res) => {
  const { id } = req.params;
  try {
    const space = await Space.findByPk(id);
    if (!space) return res.status(404).send({ message: "Space not Found" });
    res.send(space);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateSpace = [
  body("title").notEmpty().withMessage("title is required"),
  body("location").notEmpty().withMessage("location is required"),
  body("description").notEmpty().withMessage("description is required"),
  body("isChange").notEmpty().withMessage("is change is required")
  .isBoolean().withMessage("is change should be boolean")
  ,async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).send({message:errors.array().map((err)=>err.msg)})
    }
    const image = req.files.image;
    const { isChange } = req.body;
    console.log(!image && isChange)
    console.log("image:", image);
console.log("isChange:", isChange, typeof isChange);
console.log("Condition:", !image && isChange);


    if(!image && isChange === "true"){
      return res.status(422).send({message:"image required"});
    }
    const { id } = req.params; 
    const { title,location,description } = req.body;
  try {
    const space = await Space.findByPk(id)
    if (!space) return res.status(404).send({ message: "space not found" });
    space.title = title;
    space.location = location;
    space.description = description;
    if(isChange === "true"){
      fs.unlinkSync(`./uploads/${space.image}`)
    space.image = image[0].filename;
    }
    space.save()
    res.send({ message: "space updated" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}
]

exports.deleteSpace = async (req, res) => {
  const { id } = req.params;
  try {
    const space = await Space.findByPk(id);
    if (!space) return res.status(404).json({ message: "Space not found" });
    fs.unlinkSync(`./uploads/${space.image}`)
    space.destroy();
    res.send({ message: "space deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
exports.getPublicSpace = async (req,res) => {
  try {
      const spaces = await Space.findAll({
        order:[["updatedAt","DESC"]]
      });
      if(!spaces){
        res.status(404).send({err:"there are not a available spaces"});
      }
      res.send(spaces);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}