const db = require("../models");
const Assignment = db.Assignment;
const User = db.User;

exports.create = async (req, res) => {
  try {
    const { assignment_users = [], ...data } = req.body;

    const assignment = await Assignment.create(data);

    if (assignment_users.length) {
      await assignment.setUsers(assignment_users);
    }

    const full = await Assignment.findByPk(assignment.id, {
      include: [{ model: User, through: { attributes: [] } }]
    });

    res.status(201).json({ message: "Assignement créé avec succès !", data: full });
  } catch (err) {
    res.status(400).json({ message: `Erreur lors de la création : ${err.message}` });
  }
};

exports.findAll = async (req, res) => {
  try {
    const list = await Assignment.findAll({
      include: [
        {
          model: User,
          through: { attributes: [] },
          attributes: { exclude: ["password"] }
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
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          through: { attributes: [] },
          attributes: { exclude: ["password"] }
        }
      ]
    });

    if (!assignment) {
      return res.status(404).json({ message: "Aucun assignement trouvé avec cet identifiant." });
    }

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.update = async (req, res) => {
  try {
    const { assignment_users, ...data } = req.body;
    const [updated] = await Assignment.update(data, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Aucun assignement trouvé à mettre à jour." });
    }

    if (Array.isArray(assignment_users)) {
      const assignment = await Assignment.findByPk(req.params.id);
      await assignment.setUsers(assignment_users);
    }

    const fullAssignment = await Assignment.findByPk(req.params.id, {
      include: [{ model: User, through: { attributes: [] } }]
    });

    res.json({
      message: "Assignement mis à jour avec succès !",
      data: fullAssignment
    });

  } catch (err) {
    res.status(400).json({ message: `Erreur lors de la mise à jour : ${err.message}` });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Assignment.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: "Aucun assignement trouvé à supprimer." });
    }

    res.json({ message: "Assignement supprimé avec succès !" });
  } catch (err) {
    res.status(500).json({ message: `Erreur lors de la suppression : ${err.message}` });
  }
};
