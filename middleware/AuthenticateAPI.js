const ApiKey = process.env.API_KEY
module.exports = async (req,res,next) => {
    const apiHeader = req.headers.x_api_key;
    if(!apiHeader){
        return res.status(404).send({message:"API key not found"});
    }
    if(ApiKey !== apiHeader){
        return res.status(401).send({message:"API key wrong"});
    }
    next();
}