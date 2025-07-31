const { body, validationResult } = require("express-validator");
const CoworkingSpace = require("../models/Space");
const Space = require("../models/Space");
const SpaceImage = require("../models/SpaceImage");
const SpaceEquipments = require("../models/SpaceEquipments");

exports.createSpace = [
  body("name").notEmpty().withMessage("name is required"),
  body("capacity").notEmpty().withMessage("capacity is required")
  .isInt().withMessage("capacity should be number"),
  body("available").notEmpty().withMessage("name is required")
  .isBoolean().withMessage("available should be boolean"),
  body("price").notEmpty().withMessage("price is required")
  .isFloat().withMessage("capacity should be number"),
  body("description").notEmpty().withMessage("description is required"),
  body("equipments").notEmpty().withMessage("equipments is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).send({errors:errors.array().map((err)=>err.msg)})
    }
    const {
      name,
      capacity,
      available,
      price,
      description,
      equipments,
    } = req.body;

    const image = req.files ? req.files.image : null;
    try {

      const space = await Space.create({
        name,
        capacity,
        available,
        price,
        description,
      });
      image.map(element => {
        SpaceImage.create({image_url:element.filename,space_id:space.id})
      });
      equipments.map(element => {
        SpaceEquipments.create({equipment_id:element.filename,space_id:space.id})
      });

      res.status(201).send({ msg: "space is created" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
];

exports.getSpaces = [
  async (req, res) => {
    try {
      const spaces = await Space.findAll({where: {available:true}});
      if(!spaces){
        res.status(404).send({err:"there are not a available spaces"});
      }
      res.send(spaces);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
];

// Obtenir un espace par ID
exports.getSpaceById = async (req, res) => {
  try {
    const space = await CoworkingSpace.findById(req.params.id);
    if (!space) return res.status(404).json({ msg: "Espace non trouvé" });
    res.json(space);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Mettre à jour un espace
exports.updateSpace = async (req, res) => {
  try {
    const space = await CoworkingSpace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!space) return res.status(404).json({ msg: "Espace non trouvé" });
    res.json({ msg: "Espace mis à jour", space });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Supprimer un espace
exports.deleteSpace = [async (req, res) => {
  try {
    const space = await CoworkingSpace.findByIdAndDelete(req.params.id);
    if (!space) return res.status(404).json({ msg: "Espace non trouvé" });
    res.json({ msg: "Espace supprimé" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
];
