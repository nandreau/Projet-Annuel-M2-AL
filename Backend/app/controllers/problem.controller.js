const db = require("../models");
const Problem        = db.Problem;
const ProblemMessage = db.ProblemMessage;
const User           = db.User;
const Role           = db.Role;
const Chantier   = db.Chantier;
const Phase      = db.Phase;
const Task       = db.Task;
const Assignment = db.Assignment;

exports.findAll = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      include: ['roles']
    });

    const roleNames = user.roles.map(role => role.name);
    const isAdmin = roleNames.includes('admin');
    const isModerator = roleNames.includes('moderator');
    const isClient = roleNames.includes('client');

    const includeConfig = [
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
      },
      {
        model: Chantier,
        attributes: { exclude: [] }
      }
    ];

    let problems;

    if (isAdmin || isModerator) {
      // Admins and moderators: all problems
      problems = await Problem.findAll({
        include: includeConfig,
        order: [
          ["createdAt", "DESC"],
          [ProblemMessage, "id", "ASC"]
        ]
      });
    } else if (isClient) {
      // Clients: only problems where they are the client of the chantier
      problems = await Problem.findAll({
        include: [
          ...includeConfig,
          {
            model: Chantier,
            required: true,
            where: { clientId: userId }
          }
        ],
        order: [
          ["createdAt", "DESC"],
          [ProblemMessage, "id", "ASC"]
        ],
        distinct: true
      });
    } else {
      // Other roles: problems where user is the creator OR assigned to the chantier
      problems = await Problem.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            { userId: userId }
          ]
        },
        include: [
          ...includeConfig,
          {
            model: Chantier,
            required: false,
            include: [
              {
                model: Phase,
                required: true,
                include: [
                  {
                    model: Task,
                    required: true,
                    include: [
                      {
                        model: Assignment,
                        required: true,
                        include: [
                          {
                            model: User,
                            required: true,
                            where: { id: userId }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        order: [
          ["createdAt", "DESC"],
          [ProblemMessage, "id", "ASC"]
        ],
        distinct: true
      });
    }

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
        },
        {
          model: Chantier,
          attributes: { exclude: [] } 
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
  const { status, priority, images } = req.body;
  try {
    const [updatedCount] = await Problem.update(
      { status, priority, images },
      { where: { id: req.params.id } }
    );
    if (!updatedCount) {
      return res.status(404).json({ message: "Problem not found" });
    }
    const updated = await Problem.findByPk(req.params.id, {
      attributes: ["id","status","priority","images"]
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
