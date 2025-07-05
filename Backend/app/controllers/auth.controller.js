const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");

const User = db.User;
const Role = db.Role;
const RefreshToken = db.RefreshToken;

// lifetimes
const ACCESS_TOKEN_TTL = 15 * 60; // 15 minutes (in seconds)
const REFRESH_TOKEN_TTL = 7 * 24 * 3600; // 7 days

function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, config.secret, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

async function generateRefreshToken(user) {
  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
  const expiryDate = new Date(Date.now() + REFRESH_TOKEN_TTL * 1000);
  await RefreshToken.create({
    token,
    userId: user.id,
    expiryDate,
  });
  return token;
}

exports.signup = async (req, res) => {
  try {
    const { firstname, name, email, date, avatar, password, job } = req.body;

    // create the user record
    const user = await User.create({
      firstname,
      name,
      email,
      date: new Date(date),
      avatar: avatar || null,
      password: bcrypt.hashSync(password, 8),
      job: Array.isArray(job) ? job : [],
    });

    // always assign the "user" role
    const defaultRole = await Role.findOne({ where: { name: "user" } });
    await user.setRoles([defaultRole]);

    console.log(user);

    res
      .status(201)
      .send({ message: "User registered successfully with role USER!" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send({ message: "User not found." });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).send({ message: "Invalid password!" });

    // 1) issue short-lived access token
    const accessToken = generateAccessToken(user.id);

    // 2) issue long-lived refresh token & persist it
    const refreshToken = await generateRefreshToken(user);

    const roles = (await user.getRoles()).map(
      (r) => `ROLE_${r.name.toUpperCase()}`,
    );

    res.status(200).send({
      id: user.id,
      firstname: user.firstname,
      name: user.name,
      email: user.email,
      roles,
      avatar: user.avatar,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.verify = (req, res) => {
  res.status(200).send({ id: req.userId, message: "Token is valid" });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    return res.status(400).send({ message: "Refresh Token is required!" });
  }

  // 1) check it exists in DB
  const stored = await RefreshToken.findOne({ where: { token } });
  if (!stored) {
    return res.status(403).send({ message: "Refresh token not found!" });
  }
  if (stored.expiryDate < new Date()) {
    await RefreshToken.destroy({ where: { token } });
    return res
      .status(403)
      .send({ message: "Refresh token expired. Please login again." });
  }

  // 2) verify its signature
  try {
    const decoded = jwt.verify(token, config.secret);
    const userId = decoded.id;

    // 3) issue new access token
    const newAccessToken = generateAccessToken(userId);
    return res.status(200).send({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).send({ message: "Invalid refresh token!" });
  }
};

exports.signout = async (req, res) => {
  // delete the passed refresh token
  const { refreshToken: token } = req.body;
  if (token) {
    await RefreshToken.destroy({ where: { token } });
  }
  res.status(200).send({ message: "Signed out successfully" });
};
