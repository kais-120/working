const { Users } = require("../models");

module.exports = async (req,res,next) => {
    const id = req.userId;
    try{
        const user = await Users.findByPk(id);
        if(!user){
            return res.status(404).send({ message: "User not found" });
        }
        if(user.rule === "client"){
            return res.status(403).send({ message: "Access denied" })
        }
        next();
    }catch{
            return res.status(500).send({ message: "Server error" })
    }
}