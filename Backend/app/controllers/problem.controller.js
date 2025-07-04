const db = require("../models");
const Problem = db.Problem;

exports.create = async (req, res) => {
  try {
    const p = await Problem.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const list = await Problem.findAll();
  res.json(list);
};

exports.findOne = async (req, res) => {
  const p = await Problem.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
};

exports.update = async (req, res) => {
  const [updated] = await Problem.update(req.body, {
    where: { id: req.params.id }
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Updated successfully" });
};

exports.delete = async (req, res) => {
  const deleted = await Problem.destroy({
    where: { id: req.params.id }
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
