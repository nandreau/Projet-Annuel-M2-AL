// app/middleware/authJwt.js
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

const User = db.User;
const RevokedToken = db.RevokedToken;

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  try {
    const decoded = jwt.verify(token, config.secret);
    // check blacklist
    const isRevoked = await RevokedToken.findOne({ where: { token } });
    if (isRevoked) {
      return res.status(401).send({ message: "Token has been revoked." });
    }
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    user.getRoles().then((roles) => {
      if (roles.some((r) => r.name === "admin")) {
        return next();
      }
      res.status(403).send({ message: "Require Admin Role!" });
    });
  });
};

const isModerator = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    user.getRoles().then((roles) => {
      if (roles.some((r) => r.name === "moderator")) {
        return next();
      }
      res.status(403).send({ message: "Require Moderator Role!" });
    });
  });
};

const isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    user.getRoles().then((roles) => {
      if (roles.some((r) => r.name === "moderator" || r.name === "admin")) {
        return next();
      }
      res.status(403).send({ message: "Require Moderator or Admin Role!" });
    });
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};
