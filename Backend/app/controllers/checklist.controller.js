const db = require("../models");
const Checklist = db.Checklist;

exports.create = async (req, res) => {
  try {
    const item = await Checklist.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const item = await Checklist.findByPk(id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const [updatedCount] = await Checklist.update(req.body, {
      where: { id }
    });
    if (!updatedCount) return res.status(404).json({ message: "Not found" });
    const updated = await Checklist.findByPk(id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Checklist.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};