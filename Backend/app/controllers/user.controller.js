const bcrypt = require("bcryptjs");
const db     = require("../models");
const User   = db.User;
const Role   = db.Role;

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["id", "name"]
        }
      ],
      order: [["id", "ASC"]],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["id", "name"]
        }
      ]
    });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { firstname, name, email, password, job, avatar, roles } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    const user = await User.create({
      firstname, name, email,
      password: hash,
      job: Array.isArray(job) ? job : [],
      avatar: avatar || null
    });
    if (Array.isArray(roles) && roles.length) {
      const roleRecords = await Role.findAll({ where: { name: roles } });
      await user.setRoles(roleRecords);
    }
    const out = await User.findByPk(user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Role, through: { attributes: [] }, attributes: ["name"] }]
    });
    res.status(201).json(out);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { firstname, name, email, job, avatar, roles } = req.body;
    const [updated] = await User.update(
      { firstname, name, email, job, avatar },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const user = await User.findByPk(req.params.id);
    if (Array.isArray(roles)) {
      const roleRecords = await Role.findAll({ where: { name: roles } });
      await user.setRoles(roleRecords);
    }

    const out = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Role, through: { attributes: [] }, attributes: ["name"] }]
    });
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
