const jwt = require("jsonwebtoken");
const { config } = require("../config");

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json("user auth unSuccessfull");
    }
    jwt.verify(token, config.jwt.jwtSecretKey, (err, user) => {
      if (err) {
        return res.status(403).send(err);
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(400).json("Please SignIn!");
  }
};

const autherizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.user.role)) {
      return res
        .status(403)
        .send(`Role: users is not allowed to access this resource `);
    }
    next();
  };
};

module.exports = { isAuthenticatedUser, autherizeRoles };
