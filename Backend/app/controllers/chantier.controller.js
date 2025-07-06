const db = require("../models");
const Chantier   = db.Chantier;
const Phase      = db.Phase;
const Task       = db.Task;
const Assignment = db.Assignment;
const User       = db.User;

exports.create = async (req, res) => {
  try {
    console.log(req.body)
    const c = await Chantier.create(req.body);
    res.status(201).json(c);
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
        [ Phase, Task, "id",    "ASC" ],
        [ Phase, Task, Assignment, "id", "ASC" ]
      ]
    });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
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
      ]
    });

    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }
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
