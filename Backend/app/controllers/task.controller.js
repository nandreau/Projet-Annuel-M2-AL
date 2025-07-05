const db = require("../models");
const Task = db.Task;

exports.create = async (req, res) => {
  try {
    const t = await Task.create(req.body);
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const list = await Task.findAll();
  res.json(list);
};

exports.findOne = async (req, res) => {
  const t = await Task.findByPk(req.params.id);
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

exports.delete = async (req, res) => {
  const deleted = await Task.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
