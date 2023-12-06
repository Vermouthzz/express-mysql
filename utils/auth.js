const jwt = require("jsonwebtoken");
const secretKey = "lhw666";

// 生成token
module.exports.generateToken = function (payload) {
  const token =
    "Bearer " +
    jwt.sign(payload, secretKey, {
      expiresIn: 1000 * 60 * 60 * 2,
    })
  return token;
};

// 验证token
module.exports.verifyToken = function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      return res.json({ code: "403", msg: "token无效" });
    }
    // console.log("verify decoded", decoded);
    req.userinfo = decoded
    next();
  });
};
