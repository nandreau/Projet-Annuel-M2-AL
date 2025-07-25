const db = require("../models");
const Role = db.Role;

exports.findAll = async (req, res) => {
  try {
    const roles = await Role.findAll({ order: [["id", "ASC"]] });
    res.json(roles);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.findOne = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }
    res.json(role);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.create = async (req, res) => {
  try {
    const { id, name } = req.body;

    const existing = await Role.findByPk(id);
    if (existing) {
      return res.status(400).json({ message: "ID déjà utilisé" });
    }

    const role = await Role.create({ id, name });
    res.status(201).json({ message: "Rôle créé avec succès", data: role });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: `Erreur lors de la création : ${err.message}` });
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const [updated] = await Role.update(
      { name },
      { where: { id: req.params.id } },
    );

    if (!updated) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    const role = await Role.findByPk(req.params.id);
    res.json({ message: "Rôle mis à jour avec succès", data: role });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: `Erreur lors de la mise à jour : ${err.message}` });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Role.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    res.json({ message: "Rôle supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Erreur lors de la suppression : ${err.message}` });
  }
};
