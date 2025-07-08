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
    await Assignment.findByPk(assignment.id, {
      include: [{ model: User, through: { attributes: [] } }]
    });
    res.status(201).json({ message: "Created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const list = await Assignment.findAll({
    include: [{ model: User, through: { attributes: [] } }]
  });
  res.json(list);
};

exports.findOne = async (req, res) => {
  const assignment = await Assignment.findByPk(req.params.id, {
    include: [{ model: User, through: { attributes: [] } }]
  });
  if (!assignment) return res.status(404).json({ message: "Not found" });
  res.json(assignment);
};

exports.update = async (req, res) => {
  try {
    const { assignment_users, ...data } = req.body;
    const [updated] = await Assignment.update(data, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    if (Array.isArray(assignment_users)) {
      const assignment = await Assignment.findByPk(req.params.id);
      await assignment.setUsers(assignment_users);
    }
    await Assignment.findByPk(req.params.id, {
      include: [{ model: User, through: { attributes: [] } }]
    });
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  const deleted = await Assignment.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
