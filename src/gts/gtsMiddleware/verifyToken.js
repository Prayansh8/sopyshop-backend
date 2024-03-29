const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const token = req.headers["authorization"];

//   if (!token) {
//     return res.status(403).json({ error: "Token not provided" });
//   }

//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) {
//       return res.status(401).json({ error: "Failed to authenticate token" });
//     }

//     req.user = user;
//     next();
//   });
// };

// module.exports = { verifyToken };
const authenticateToken = (req, res, next) => {
  const secretKey = "secret_key";
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    req.userId = user._id;
    next();
  });
};

module.exports = { authenticateToken };
