const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.User;
const Role = db.Role;

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["name"]
        }
      ],
      order: [["id", "ASC"]],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Erreur lors de la récupération : ${err.message}` });
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
          attributes: ["name"]
        }
      ]
    });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.create = async (req, res) => {
  try {
    const { firstname, name, email, password, job, avatar, roles } = req.body;

    const hash = bcrypt.hashSync(password, 8);

    const user = await User.create({
      firstname,
      name,
      email,
      password: hash,
      job: Array.isArray(job) ? job : [],
      avatar: avatar || null
    });

    // Handle roles: use provided or default to 'user'
    if (Array.isArray(roles) && roles.length) {
      const roleRecords = await Role.findAll({ where: { name: roles } });
      await user.setRoles(roleRecords);
    } else {
      const defaultRole = await Role.findOne({ where: { name: 'user' } });
      await user.setRoles([defaultRole]);
    }

    const out = await User.findByPk(user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["name"]
        }
      ]
    });

    res.status(201).json({ message: "Utilisateur créé avec succès", data: out });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: `Erreur lors de la création : ${err.message}` });
  }
};

exports.update = async (req, res) => {
  try {
    const { firstname, name, email, job, avatar, roles, password } = req.body;

    const updateData = { firstname, name, email, job, avatar };
    // Handle password update if provided
    if (password) {
      const hash = bcrypt.hashSync(password, 8);
      updateData.password = hash;
    }

    const [updated] = await User.update(
      updateData,
      { where: { id: req.params.id } }
    );

    if (!updated) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const user = await User.findByPk(req.params.id);
    // Handle roles update if provided
    if (Array.isArray(roles)) {
      const roleRecords = await Role.findAll({ where: { name: roles } });
      await user.setRoles(roleRecords);
    }

    const out = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["name"]
        }
      ]
    });

    res.json({ message: "Utilisateur mis à jour avec succès", data: out });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: `Erreur lors de la mise à jour : ${err.message}` });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Erreur lors de la suppression : ${err.message}` });
  }
};