const db = require("../models");
const ProblemMessage = db.ProblemMessage;
const User           = db.User;
const Role           = db.Role;

exports.create = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.userId,
    };

    const msg = await ProblemMessage.create(payload);

    const data = await ProblemMessage.findByPk(msg.id, {
      attributes: { exclude: ["userId"] },
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
          include: [
            { model: Role, through: { attributes: [] } }
          ]
        }
      ]
    });

    res.status(201).json({ message: "Created successfully", data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  const list = await ProblemMessage.findAll({
    include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
          include: [
            { model: Role, through: { attributes: [] } }
          ]
        }
      ],
      order: [
        [ "id",  "ASC" ]
      ]
  });
  res.json(list);
};

exports.findOne = async (req, res) => {
  const m = await ProblemMessage.findByPk(req.params.id, {
    include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
          include: [
            { model: Role, through: { attributes: [] } }
          ]
        }
      ]
  });
  if (!m) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Created successfully" });
};

exports.update = async (req, res) => {
  const [updated] = await ProblemMessage.update(req.body, {
    where: { id: req.params.id },
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Updated successfully" });
};

exports.delete = async (req, res) => {
  const deleted = await ProblemMessage.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
