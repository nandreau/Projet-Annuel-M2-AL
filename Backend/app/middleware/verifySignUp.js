const db = require("../models");
const ROLES = db.ROLES;
const User = db.User;

async function checkDuplicateEmail(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: "Email is required!" });
  }
  const user = await User.findOne({ where: { email } });
  if (user) {
    return res.status(400).send({ message: "Failed! Email is already in use!" });
  }
  next();
}

function checkRolesExisted(req, res, next) {
  const { roles } = req.body;
  if (roles) {
    for (let r of roles) {
      if (!ROLES.includes(r)) {
        return res.status(400).send({
          message: "Failed! Role does not exist = " + r
        });
      }
    }
  }
  next();
}

module.exports = { checkDuplicateEmail, checkRolesExisted };
