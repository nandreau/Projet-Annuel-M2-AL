const jwt    = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db     = require("../models");

const User = db.User;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired!" });
      }
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (!user) return res.status(404).send({ message: "User not found." });
    user.getRoles().then(roles => {
      if (roles.some(r => r.name === "admin")) {
        next();
      } else {
        res.status(403).send({ message: "Require Admin Role!" });
      }
    });
  });
};

const isArtisan = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (!user) return res.status(404).send({ message: "User not found." });
    user.getRoles().then(roles => {
      if (roles.some(r => r.name === "artisan")) {
        next();
      } else {
        res.status(403).send({ message: "Require Artisan Role!" });
      }
    });
  });
};

const isArtisanOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (!user) return res.status(404).send({ message: "User not found." });
    user.getRoles().then(roles => {
      if (roles.some(r => ["artisan","admin"].includes(r.name))) {
        next();
      } else {
        res.status(403).send({ message: "Require Artisan or Admin Role!" });
      }
    });
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  isArtisan,
  isArtisanOrAdmin,
};
