const jwt = require("jsonwebtoken");
const tokenKey = "secret";

module.exports = {
  validateUserData: (req, res, next) => {
    if (req.body.userName && req.body.email && req.body.fullName && req.body.phone && req.body.address && req.body.pass) {
      next();
    } else {
      res.status(400).json({"msj":"All fields are required"});
    }
  },
  validateProductData: (req, res, next) => {
    if (req.body.name && req.body.price && req.body.imgUrl) {
      next();
    } else {
      res.status(400).json({"msj":"All fields are required"});
    }
  },
  validateOrderData: (req, res, next) => {
    if (req.body.total && req.body.pay_method_id && req.body.items) {
      next();
    } else {
      res.status(400).json({"msj":"All fields are required"});
    }
  },
  validacionJWT: (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const verificarToken = jwt.verify(token, tokenKey);
      if (verificarToken) {
        req.infoToken = verificarToken;
        return next();
      }
    } catch (error) {
      res.status(401).json({"msj":"User unauthorized"});
    }
  },
  validacionJWTAdmin: (req, res, next) => {
    try {
      const token = req.headers.authorization;
      const verificarToken = jwt.verify(token, tokenKey);
      console.log(verificarToken);
      if (verificarToken) {
        req.infoToken = verificarToken;
        if (req.infoToken.admin) {
          return next();
        } else {
          res.status(401).json({"msj":"User unauthorized"});
        }
      }
    } catch (error) {
      res.status(401).json({"msj":"unknown error"});
    }
  },
};