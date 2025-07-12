const db = require("../models");
const Phase = db.Phase;
const Task = db.Task;
const Assignment = db.Assignment;
const Checklist = db.Checklist;
const User = db.User;

exports.create = async (req, res) => {
  try {
    const phase = await Phase.create(req.body);
    res.status(201).json({ message: "Phase créée avec succès", data: phase });
  } catch (err) {
    res.status(400).json({ message: `Erreur lors de la création : ${err.message}` });
  }
};

exports.findAll = async (req, res) => {
  try {
    const list = await Phase.findAll({
      include: [
        {
          model: Task,
          include: [
            { model: Checklist },
            {
              model: Assignment,
              include: [
                {
                  model: User,
                  through: { attributes: [] },
                  attributes: { exclude: ["password"] }
                }
              ]
            }
          ]
        }
      ],
      order: [
        ["id", "ASC"],
        [Task, "updatedAt", "ASC"],
        [Task, "id", "ASC"],
        [Task, Assignment, "id", "ASC"],
        [Task, Checklist, "id", "ASC"]
      ]
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.findOne = async (req, res) => {
  try {
    const p = await Phase.findByPk(req.params.id, {
      include: [
        {
          model: Task,
          include: [
            { model: Checklist },
            {
              model: Assignment,
              include: [
                {
                  model: User,
                  through: { attributes: [] },
                  attributes: { exclude: ["password"] }
                }
              ]
            }
          ]
        }
      ],
      order: [
        [Task, "updatedAt", "ASC"],
        [Task, "id", "ASC"],
        [Task, Assignment, "id", "ASC"],
        [Task, Checklist, "id", "ASC"]
      ]
    });

    if (!p) return res.status(404).json({ message: "Phase non trouvée" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Phase.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: "Phase non trouvée" });

    const phase = await Phase.findByPk(req.params.id);
    res.json({ message: "Mise à jour réussie", data: phase });
  } catch (err) {
    res.status(400).json({ message: `Erreur lors de la mise à jour : ${err.message}` });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Phase.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Phase non trouvée" });
    res.json({ message: "Suppression réussie" });
  } catch (err) {
    res.status(500).json({ message: `Erreur lors de la suppression : ${err.message}` });
  }
};