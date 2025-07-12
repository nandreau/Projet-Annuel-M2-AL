const { extractIntervenants } = require('../utils/chantier');
const db = require("../models");
const Chantier   = db.Chantier;
const Phase      = db.Phase;
const Task       = db.Task;
const Assignment = db.Assignment;
const Checklist  = db.Checklist;
const User       = db.User;

exports.create = async (req, res) => {
  try {
    console.log(req.body)
    await Chantier.create(req.body);
    res.status(201).json({ message: "Created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const list = await Chantier.findAll({
      include: [
        { 
          model: User, 
          as: "client", 
          attributes: { exclude: ["password"] } 
        },
        {
          model: Phase,
          include: [
            {
              model: Task,
              include: [
                {
                  model: Checklist
                },
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
          ]
        }
      ],
      order: [
        ["id", "ASC"],
        [ Phase,       "id",    "ASC" ],
        [ Phase, Task, "updatedAt", "ASC"],
        [ Phase, Task, "id",    "ASC" ],
        [ Phase, Task, Assignment, "id", "ASC" ],
        [ Phase, Task, Checklist, "id", "ASC" ]
      ]
    });
    const withIntervenants = list.map(ct => {
      ct.dataValues.intervenants = extractIntervenants(ct);
      return ct;
    });
    res.json(withIntervenants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.findAssignedUsers = async (req, res) => {
  const chantierId = +req.params.id;
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    include: [{
      model: Assignment,
      through: { attributes: [] },
      required: true,
      include: [{
        model: Task,
        required: true,
        include: [{
          model: Phase,
          required: true,
          where: { chantierId }
        }]
      }]
    }],
    order: [['id', 'ASC']],
    distinct: true
  });
  res.json(users);
};

exports.findOne = async (req, res) => {
  try {
    const chantier = await Chantier.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: "client", 
          attributes: { exclude: ["password"] } 
        },
        {
          model: Phase,
          include: [
            {
              model: Task,
              include: [
                {
                  model: Checklist
                },
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
          ]
        }
      ],
      order: [
        [ Phase,       "id",    "ASC" ],
        [ Phase, Task, "updatedAt", "ASC"],
        [ Phase, Task, "id",    "ASC" ],
        [ Phase, Task, Assignment, "id", "ASC" ],
        [ Phase, Task, Checklist, "id", "ASC" ]
      ]
    });

    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }
    chantier.dataValues.intervenants = extractIntervenants(chantier);
    res.json(chantier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Chantier.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: "Chantier non trouvé" });
    res.json({ message: "Mise à jour réussie" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Chantier.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: "Chantier non trouvé" });
    res.json({ message: "Suppression réussie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
