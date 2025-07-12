const db = require("../models");
const Chantier = db.Chantier;
const Phase = db.Phase;
const Task = db.Task;
const Assignment = db.Assignment;
const Checklist = db.Checklist;
const User = db.User;

exports.create = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ message: "Tâche créée avec succès", data: task });
  } catch (err) {
    res.status(400).json({ message: `Erreur lors de la création : ${err.message}` });
  }
};

exports.findAll = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, { include: ['roles'] });
    if (!user || !user.roles) throw new Error("Utilisateur ou rôles introuvables");

    const roleNames = user.roles.map(role => role.name);
    const isAdmin = roleNames.includes('admin');
    const isModerator = roleNames.includes('moderator');
    const isClient = roleNames.includes('client');

    const includeConfig = [
      { model: Checklist },
      {
        model: Assignment,
        include: [{
          model: User,
          through: { attributes: [] },
          attributes: { exclude: ["password"] }
        }]
      }
    ];

    let tasks;

    if (isAdmin || isModerator) {
      tasks = await Task.findAll({
        include: includeConfig,
        order: [["id", "ASC"], [Assignment, "id", "ASC"], [Checklist, "id", "ASC"]]
      });
    } else if (isClient) {
      tasks = await Task.findAll({
        include: [
          ...includeConfig,
          {
            model: Phase,
            required: true,
            include: [{
              model: Chantier,
              required: true,
              where: { clientId: userId }
            }]
          }
        ],
        order: [["id", "ASC"], [Assignment, "id", "ASC"], [Checklist, "id", "ASC"]],
        distinct: true
      });
    } else {
      tasks = await Task.findAll({
        include: [
          ...includeConfig,
          {
            model: Assignment,
            required: true,
            include: [{
              model: User,
              required: true,
              where: { id: userId }
            }]
          }
        ],
        order: [["id", "ASC"], [Assignment, "id", "ASC"], [Checklist, "id", "ASC"]],
        distinct: true
      });
    }

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Erreur lors de la récupération : ${err.message}` });
  }
};

exports.findOne = async (req, res) => {
  try {
    const t = await Task.findByPk(req.params.id, {
      include: [
        { model: Checklist },
        {
          model: Assignment,
          include: [{
            model: User,
            through: { attributes: [] },
            attributes: { exclude: ["password"] }
          }]
        }
      ],
      order: [[Assignment, "id", "ASC"], [Checklist, "id", "ASC"]]
    });

    if (!t) return res.status(404).json({ message: "Tâche non trouvée" });

    res.json(t);
  } catch (err) {
    console.error("Erreur dans findOne :", err);
    res.status(500).json({ message: `Erreur : ${err.message}` });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Task.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: "Tâche non trouvée" });

    const task = await Task.findByPk(req.params.id);
    res.json({ message: "Tâche mise à jour avec succès", data: task });
  } catch (err) {
    console.error("Erreur dans update :", err);
    res.status(500).json({ message: `Erreur : ${err.message}` });
  }
};

exports.updateMeta = async (req, res) => {
  const allowed = ['priority', 'dueDate', 'name', 'description'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  try {
    const actualTask = await Task.findByPk(req.params.id);
    if (actualTask.done) {
      return res.status(400).json({ message: "Tâche déjà validée, modification interdite" });
    }

    const [updated] = await Task.update(updates, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: "Tâche non trouvée" });

    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Checklist },
        {
          model: Assignment,
          include: [{
            model: User,
            through: { attributes: [] },
            attributes: { exclude: ["password"] }
          }]
        }
      ]
    });

    res.json({ message: "Tâche mise à jour avec succès", data: task });
  } catch (err) {
    console.error("Erreur dans updateMeta :", err);
    res.status(500).json({ message: `Erreur : ${err.message}` });
  }
};

exports.validate = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
    if (task.done) return res.status(400).json({ message: "Tâche déjà validée" });

    const images = req.body.images;
    if (images && Array.isArray(images)) {
      task.images = images;
    }

    const imgs = task.images || [];
    if (!Array.isArray(imgs) || imgs.length < 1) {
      return res.status(400).json({ message: "Validation impossible : au moins une image est requise" });
    }

    task.done = true;
    task.doneDate = new Date();
    await task.save();

    const updated = await Task.findByPk(req.params.id, {
      include: [
        { model: Checklist },
        {
          model: Assignment,
          include: [{
            model: User,
            through: { attributes: [] },
            attributes: { exclude: ["password"] }
          }]
        }
      ]
    });

    res.json({ message: "Tâche validée avec succès", data: updated });
  } catch (err) {
    console.error("Erreur dans validate :", err);
    res.status(500).json({ message: `Erreur : ${err.message}` });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Task.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    console.error("Erreur dans delete :", err);
    res.status(500).json({ message: `Erreur : ${err.message}` });
  }
};