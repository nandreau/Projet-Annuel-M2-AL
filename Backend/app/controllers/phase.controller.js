const db = require("../models");
const Phase = db.Phase;

exports.create = async (req, res) => {
  try {
    await Phase.create(req.body);
    res.status(201).json({ message: "Created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const list = await Phase.findAll();
  res.json(list);
};

exports.findOne = async (req, res) => {
  const p = await Phase.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
};

exports.update = async (req, res) => {
  const [updated] = await Phase.update(req.body, {
    where: { id: req.params.id },
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Updated successfully" });
};

exports.delete = async (req, res) => {
  const deleted = await Phase.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
