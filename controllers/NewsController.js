const { body, validationResult } = require("express-validator");
const News = require("../models/News");

exports.createNews = [
    body("status").notEmpty().withMessage("status is required"),
    body("category").notEmpty().withMessage("category is required")
    .isIn(["nouveautés","services","événements","maintenance","promotions"]),
    body("content").notEmpty().withMessage("content is required"),
    body("titre").notEmpty().withMessage("titre is required"),
    body("date_start").custom((value, { req }) => {
    const category = req.body.category;
    if ((category === "événements" || category === "promotions") && !value) {
      throw new Error("date_start est requise pour les Événements ou Promotions");
    }
    return true;
  }),
  body("time_start").custom((value, { req }) => {
    if (req.body.category === "événements" && !value) {
      throw new Error("time_start est requise pour les Événements");
    }
    return true;
  }),
  body("date_end").custom((value, { req }) => {
    if (req.body.category === "promotions" && !value) {
      throw new Error("date_end est requise pour les Promotions");
    }
    return true;
  }),
    async (req,res) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(422).send(error.array().map((err)=>err.msg));
        }
        const image = req.files.image
        if(!image){
            return res.status(422).send({msg:"image required"});
        }
        const {status,category,content,titre,date_start,date_end,date_time} = req.body;
        try{
            await News.create({status,category,content,titre,image:image[0].filename,date_start,date_end,date_time});
            return res.status(201).send({message:"new add"})
        }catch(err){
            return res.status(500).send(err)
        }
        
    }
]
exports.getAll = async (req,res) => {
    const { page } = req.params;
    const offset = (page - 1) * 5;
    try{
        const news = await News.findAndCountAll({limit:5,offset,order:[['updatedAt','desc']]})
        const publish = await News.findAndCountAll({where:{status:"publish"}})
        const unpublish = await News.findAndCountAll({where:{status:"unpublish"}})
        const totalPage = Math.ceil(news.count / 5);
        return res.send({news,page,totalPage,countPublish:publish.count,countUnpublish:unpublish.count})
    }catch(err){
        return res.status(500).send({message:err})
    }
}

exports.getById = async (req,res) => {
    const { id } = req.params;
    try{
        const news = await News.findByPk(id)
        if(!news){
            return res.status(404).send({message:"new no found"})
        }
        return res.send(news)
    }catch{
        return res.status(500).send({message:"server error"})
    }
}

exports.getPublic = async (req,res) => {
    try{
        const news = await News.findAll({where: {status:"publish"},order:[['updatedAt','desc']]})
        return res.send(news)
    }catch{
        return res.status(500).send({message:"server error"})
    }
}

exports.updateNews = [
     body("status").notEmpty().withMessage("status is required"),
    body("category").notEmpty().withMessage("category is required")
    .isIn(["nouveautés","services","événements","maintenance","promotions"]),
    body("content").notEmpty().withMessage("content is required"),
    body("titre").notEmpty().withMessage("titre is required"),
    body("imageChange").notEmpty().withMessage("image change is required")
    .isBoolean().withMessage("should be boolean"),
     body("date_start").custom((value, { req }) => {
    const category = req.body.category;
    if ((category === "événements" || category === "promotions") && !value) {
      throw new Error("date_start est requise pour les Événements ou Promotions");
    }
    return true;
  }),
  body("time_start").custom((value, { req }) => {
    if (req.body.category === "événements" && !value) {
      throw new Error("time_start est requise pour les Événements");
    }
    return true;
  }),
  body("date_end").custom((value, { req }) => {
    if (req.body.category === "promotions" && !value) {
      throw new Error("date_end est requise pour les Promotions");
    }
    return true;
  }),
    async (req,res) => {
         const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(422).send(error.array().map((err)=>err.msg));
        }
        const {imageChange} = req.body;
        const image = req.files.image
        console.log(imageChange)
        if(!image && imageChange  === "true" ){
            return res.status(422).send({msg:"image required"});
        }
        const {status,category,content,titre,date_end,date_time,date_start} = req.body;
        const { id } = req.params;
        try{
        const news = await News.findByPk(id)
        if(!news){
            return res.status(404).send({message:"new no found"})
        }
        if(imageChange === "true" ){
            await news.update({status,category,content,titre,image:image[0].filename,date_end,date_time,date_start})
        }
        else{
            await news.update({status,category,content,titre,date_end,date_time,date_start})
        }
        return res.send({message:"new has updated"})
    }catch(err){
        console.log(err)
        return res.status(500).send({message:"server error"})
    }

    }
]
exports.deleteNews = async (req,res) => {
    const { id } = req.params;
    try{
        const news = await News.findByPk(id)
        if(!news){
            return res.status(404).send({message:"new no found"})
        }
        news.destroy()
        return res.send({message:"news deleted"})
    }catch{
        return res.status(500).send({message:"server error"})
    }
}
exports.updateStatus = 
    async (req,res) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(422).send(error.array().err);
        }
    const { id } = req.params;
    const news  = await News.findByPk(id);
    if(!news){
        return res.status(404).send({message:"news not found"});
    }
    news.status = news.status === "publish" ? "unpublish" : "publish";
    news.save();
    return res.status(202).send({message:"news status is updated"});
    }