const db       = require("../models");
const jwt      = require("jsonwebtoken");
const bcrypt   = require("bcryptjs");
const config   = require("../config/auth.config.js");

const User         = db.User;
const Role         = db.Role;
const RefreshToken = db.RefreshToken;

// lifetimes
const ACCESS_TOKEN_TTL  = 60 * 60;        // 60 minutes in seconds
const REFRESH_TOKEN_TTL = 7 * 24 * 3600;  // 7 days in seconds

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
    revokedAt: null,
  });
  return token;
}

exports.signup = async (req, res) => {
  try {
    const { firstname, name, email, date, avatar, password, job } = req.body;
    const user = await User.create({
      firstname,
      name,
      email,
      date: new Date(date),
      avatar: avatar || null,
      password: bcrypt.hashSync(password, 8),
      job: Array.isArray(job) ? job : [],
    });

    const defaultRole = await Role.findOne({ where: { name: "user" } });
    await user.setRoles([defaultRole]);

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

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ message: "Invalid password!" });
    }

    // issue tokens
    const accessToken  = generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user);

    const roles = (await user.getRoles()).map(
      r => `ROLE_${r.name.toUpperCase()}`
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
  const { refreshToken: incoming } = req.body;
  if (!incoming) {
    return res.status(400).send({ message: "Refresh Token is required!" });
  }

  try {
    // 1) fetch & validate
    const stored = await RefreshToken.findOne({ where: { token: incoming } });
    if (
      !stored ||
      stored.expiryDate < new Date() ||
      stored.revokedAt !== null
    ) {
      return res
        .status(403)
        .send({ message: "Refresh token is invalid or expired." });
    }

    // 2) verify its JWT
    const decoded = jwt.verify(incoming, config.secret);

    // 3) revoke old refresh token
    await stored.update({ revokedAt: new Date() });

    // 4) issue new pair
    const user       = await User.findByPk(decoded.id);
    const newRefresh = await generateRefreshToken(user);
    const newAccess  = generateAccessToken(user.id);

    return res.status(200).send({
      accessToken: newAccess,
      refreshToken: newRefresh,
    });
  } catch (err) {
    return res.status(403).send({
      message:
        err.name === "TokenExpiredError"
          ? "Refresh token expired. Please sign in again."
          : "Invalid refresh token!",
    });
  }
};

exports.signout = async (req, res) => {
  const { refreshToken: incoming } = req.body;
  if (incoming) {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { token: incoming } }
    );
  }
  res.status(200).send({ message: "Signed out successfully!" });
};
