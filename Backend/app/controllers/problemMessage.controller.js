const db = require("../models");
const ProblemMessage = db.ProblemMessage;
const User = db.User;
const Role = db.Role;

exports.create = async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.userId };

    const created = await ProblemMessage.create(payload);

    const full = await ProblemMessage.findByPk(created.id, {
      attributes: { exclude: ["userId"] },
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
          include: [{ model: Role, through: { attributes: [] } }]
        }
      ]
    });

    res.status(201).json({ message: "Message ajouté avec succès", data: full });
  } catch (err) {
    res.status(400).json({ message: `Erreur lors de la création : ${err.message}` });
  }
};

exports.findAll = async (req, res) => {
  try {
    const list = await ProblemMessage.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
          include: [{ model: Role, through: { attributes: [] } }]
        }
      ],
      order: [["id", "ASC"]]
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.findOne = async (req, res) => {
  try {
    const m = await ProblemMessage.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
          include: [{ model: Role, through: { attributes: [] } }]
        }
      ]
    });
    if (!m) return res.status(404).json({ message: "Message non trouvé" });
    res.json(m);
  } catch (err) {
    res.status(500).json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await ProblemMessage.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: "Message non trouvé" });

    const message = await ProblemMessage.findByPk(req.params.id);
    res.json({ message: "Message mis à jour avec succès", data: message });
  } catch (err) {
    res.status(400).json({ message: `Erreur lors de la mise à jour : ${err.message}` });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await ProblemMessage.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: "Message non trouvé" });
    res.json({ message: "Message supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: `Erreur lors de la suppression : ${err.message}` });
  }
};