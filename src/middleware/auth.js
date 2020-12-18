const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async function (req, res, next) {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_STRING);
    const user = await User.findOne({
      _id: decode._id,
    });

    if (!user) {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).send({
      error: "Invalid token",
    });
  }
};

module.exports = auth;
