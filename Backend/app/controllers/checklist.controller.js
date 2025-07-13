const db = require("../models");
const Checklist = db.Checklist;

exports.create = async (req, res) => {
  try {
    const item = await Checklist.create(req.body);
    res.status(201).json({ message: "Élément créé avec succès", data: item });
  } catch (err) {
    res
      .status(400)
      .json({ message: `Erreur lors de la création : ${err.message}` });
  }
};

exports.findAll = async (req, res) => {
  const where = {};
  if (req.query.taskId) where.taskId = req.query.taskId;

  try {
    const items = await Checklist.findAll({
      where,
      order: [["id", "ASC"]],
    });
    res.json(items);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const item = await Checklist.findByPk(id);
    if (!item) return res.status(404).json({ message: "Élément non trouvé" });
    res.json(item);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const [updatedCount] = await Checklist.update(req.body, {
      where: { id },
    });

    if (!updatedCount)
      return res.status(404).json({ message: "Élément non trouvé" });

    const updated = await Checklist.findByPk(id);
    res.json({ message: "Mise à jour réussie", data: updated });
  } catch (err) {
    res
      .status(400)
      .json({ message: `Erreur lors de la mise à jour : ${err.message}` });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Checklist.destroy({ where: { id } });
    if (!deleted)
      return res.status(404).json({ message: "Élément non trouvé" });
    res.json({ message: "Suppression réussie" });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Erreur lors de la suppression : ${err.message}` });
  }
};
