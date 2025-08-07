const { body, validationResult } = require("express-validator");
const Review = require("../models/Review");
const Users = require("../models/Users");

exports.createReview = [
  body("review").notEmpty().withMessage("review is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("rating").notEmpty().withMessage("rating is required")
  .isInt().withMessage("rating should be number"),
  async (req, res) => {
    const user_id = req.userId
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).send({errors:errors.array().map((err)=>err.msg)})
    }
    const {review,rating,position} = req.body;

    try {
      await Review.create({review,rating,position,user_id});
      res.status(201).send({ msg: "review is created" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
];

exports.getReview = async (req, res) => {
    try {
      const { page } = req.params;
      const offset = (page - 1) * 10;
      const reviews = await Review.findAndCountAll({
        limit:10,
        offset,
        include:{
          model:Users,
          as:"userReviews",
          attributes:["id","name","last_name","email"]
        }
      });
      if(!reviews){
        res.status(404).send({err:"there are not a available review"});
      }
      const totalPage = Math.ceil(reviews.count / 10);
      res.send({reviews,page,totalPage});
    } catch (err) {
      res.status(500).json({ msg: err.message });
      console.log(err)
    }
  },

exports.getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ msg: "review non trouvé" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ msg: "review no found" });
    review.status = status;
    review.save()
    res.json({ msg: "review mis à jour" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getReviewPublic = async (req, res) => {
    try {
      const reviews = await Review.findAll({
        where: {
          status:"accept"
        },
        order:[["updatedAt","DESC"]],
        limit:5,
        include:{
          model:Users,
          as:"userReviews",
          attributes:["name"]
        }
      });
      if(!reviews){
        res.status(404).send({err:"there are not a available review"});
      }
      res.send(reviews);
    } catch (err) {
      res.status(500).json({ msg: 'server error'});
      console.log(err)
    }
}