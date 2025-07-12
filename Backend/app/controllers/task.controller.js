const db = require("../models");
const Task       = db.Task;
const Assignment = db.Assignment;
const Checklist  = db.Checklist;
const User       = db.User;

exports.create = async (req, res) => {
  try {
    await Task.create(req.body);
    res.status(201).json({ message: "Created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const list = await Task.findAll({
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
    ],
    order: [
      ["id", "ASC"],
      [ Assignment, "id", "ASC" ],
      [ Checklist, "id", "ASC" ]
    ]
  });
  res.json(list);
};

exports.findOne = async (req, res) => {
  const t = await Task.findByPk(req.params.id, {
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
    ],
    order: [
      [ Assignment, "id", "ASC" ],
      [ Checklist, "id", "ASC" ]
    ]
  });
  if (!t) return res.status(404).json({ message: "Not found" });
  res.json(t);
};

exports.update = async (req, res) => {
  const [updated] = await Task.update(req.body, {
    where: { id: req.params.id },
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Updated successfully" });
};

exports.updateMeta = async (req, res) => {
  const allowed = ['priority','dueDate', 'name', 'description'];
  // pick only allowed fields
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  try {
    const actualTask = await Task.findByPk(req.params.id);
    if (actualTask.done) {
      return res.status(404).json({ message: "Task Cannot be modified while done" });
    }
    const [updated] = await Task.update(updates, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }
    // return the full, fresh task (including associations if you like)
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Checklist },
        { 
          model: Assignment,
          include: [{ model: User, through: { attributes: [] }, attributes: { exclude: ['password'] } }]
        }
      ]
    });
    res.json(task);
  } catch (err) {
    console.error("Error in updateMeta:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.validate = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.done) {
      return res.status(400).json({ message: "Task was already validated" });
    }

    const images = req.body.images;
    if (images && Array.isArray(images)) {
      task.images = images;
    }

    const imgs = task.images || [];
    if (!Array.isArray(imgs) || imgs.length < 1) {
      return res.status(400).json({ 
        message: "Cannot validate: at least one image is required." 
      });
    }

    task.done = true;
    task.doneDate = new Date();
    await task.save();

    const updated = await Task.findByPk(req.params.id, {
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
    });

    res.json({ message: "Task was validated", data: updated, });
  } catch (err) {
    console.error("Error in validate:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  const deleted = await Task.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
