const db = require("../models");
const Chantier = db.Chantier;

exports.create = async (req, res) => {
  try {
    const c = await Chantier.create(req.body);
    res.status(201).json(c);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const list = await Chantier.findAll();
  res.json(list);
};

exports.findOne = async (req, res) => {
  const c = await Chantier.findByPk(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });
  res.json(c);
};

exports.update = async (req, res) => {
  const [updated] = await Chantier.update(req.body, {
    where: { id: req.params.id }
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Updated successfully" });
};

exports.delete = async (req, res) => {
  const deleted = await Chantier.destroy({
    where: { id: req.params.id }
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
