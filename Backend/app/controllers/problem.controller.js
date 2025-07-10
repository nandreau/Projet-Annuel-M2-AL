const db = require("../models");
const Problem        = db.Problem;
const ProblemMessage = db.ProblemMessage;
const User           = db.User;
const Role           = db.Role;

exports.findAll = async (req, res) => {
  try {
    const problems = await Problem.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
          include: [
            { model: Role, through: { attributes: [] } }
          ]
        },
        {
          model: ProblemMessage,
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
        }
      ],
      order: [
        ["createdAt", "DESC"],
        [ ProblemMessage, "id",  "ASC" ]
      ]
    });

    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const p = await Problem.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
          include: [{ model: Role, through: { attributes: [] } }]
        },
        {
          model: ProblemMessage,
          attributes: { exclude: ["userId"] },
          include: [
            {
              model: User,
              attributes: { exclude: ["password"] },
              include: [{ model: Role, through: { attributes: [] } }]
            }
          ]
        }
      ],
      order: [
        [ ProblemMessage, "id",  "ASC" ]
      ]
    });

    if (!p) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateMeta = async (req, res) => {
  const { status, urgency, images } = req.body;
  try {
    const [updatedCount] = await Problem.update(
      { status, urgency, images },
      { where: { id: req.params.id } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: "Problem not found" });
    }
    const updated = await Problem.findByPk(req.params.id, {
      attributes: ["id","status","urgency","images"]
    });
    res.json({ message: "Meta updated", data: updated });
  } catch (err) {
    console.error("Error in updateMeta:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    await Problem.create(req.body);
    res.status(201).json({ message: "Created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  const [updated] = await Problem.update(req.body, {
    where: { id: req.params.id },
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Updated successfully" });
};

exports.delete = async (req, res) => {
  const deleted = await Problem.destroy({
    where: { id: req.params.id },
  });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
