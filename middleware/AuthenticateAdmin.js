const Users = require("../models/Users");

module.exports = async (req, res, next) => {
  try {
    const id = req.userId;
    const user = await Users.findByPk(id);

    if (user.rule !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  } catch (err) {
    res.status(400).json({ message: "same thing wrong" });
  }
};
