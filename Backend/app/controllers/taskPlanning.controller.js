const db = require("../models");
const TaskPlanning = db.TaskPlanning;

exports.create = async (req, res) => {
  try {
    const tp = await TaskPlanning.create(req.body);
    res.status(201).json(tp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const list = await TaskPlanning.findAll();
  res.json(list);
};

exports.findOne = async (req, res) => {
  const tp = await TaskPlanning.findByPk(req.params.id);
  if (!tp) return res.status(404).json({ message: "Not found" });
  res.json(tp);
};

exports.update = async (req, res) => {
  const [updated] = await TaskPlanning.update(req.body, {
    where: { id: req.params.id }
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Updated successfully" });
};

exports.delete = async (req, res) => {
  const deleted = await TaskPlanning.destroy({
    where: { id: req.params.id }
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
