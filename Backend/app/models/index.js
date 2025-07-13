const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Role = require("./role.model.js")(sequelize, Sequelize);
db.Assignment = require("./assignment.model.js")(sequelize, Sequelize);
db.Task = require("./task.model.js")(sequelize, Sequelize);
db.Phase = require("./phase.model.js")(sequelize, Sequelize);
db.Chantier = require("./chantier.model.js")(sequelize, Sequelize);
db.Problem = require("./problem.model.js")(sequelize, Sequelize);
db.ProblemMessage = require("./problemMessage.model.js")(sequelize, Sequelize);
db.Checklist = require("./checklist.model.js")(sequelize, Sequelize);

db.RefreshToken = require("./refreshToken.model.js")(sequelize, Sequelize);

// Associations
// User <-> Role (Many-to-Many)
db.User.belongsToMany(db.Role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});
db.Role.belongsToMany(db.User, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

// Assignment <-> User (Many-to-Many)
db.Assignment.belongsToMany(db.User, { through: "assignment_users" });
db.User.belongsToMany(db.Assignment, { through: "assignment_users" });

// Assignment -> Task (One-to-Many)
db.Task.hasMany(db.Assignment, { foreignKey: "taskId" });
db.Assignment.belongsTo(db.Task, { foreignKey: "taskId" });

// Phase -> Task (One-to-Many)
db.Phase.hasMany(db.Task, { foreignKey: "phaseId" });
db.Task.belongsTo(db.Phase, { foreignKey: "phaseId" });

// Chantier -> Phase (One-to-Many)
db.Chantier.hasMany(db.Phase, { foreignKey: "chantierId" });
db.Phase.belongsTo(db.Chantier, { foreignKey: "chantierId" });

// Chantier -> User (Client) (Many-to-One)
db.Chantier.belongsTo(db.User, { as: "client", foreignKey: "clientId" });
db.User.hasMany(db.Chantier, { foreignKey: "clientId" });

// Problem -> Chantier (Reporter) (Many-to-One)
db.Problem.belongsTo(db.Chantier, { foreignKey: "chantierId" });
db.Chantier.hasMany(db.Problem, { foreignKey: "chantierId" });

// Problem -> User (Reporter) (Many-to-One)
db.Problem.belongsTo(db.User, { foreignKey: "userId" });
db.User.hasMany(db.Problem, { foreignKey: "userId" });

// ProblemMessage -> Problem (Many-to-One)
db.Problem.hasMany(db.ProblemMessage, { foreignKey: "problemId" });
db.ProblemMessage.belongsTo(db.Problem, { foreignKey: "problemId" });

// ProblemMessage -> User (user) (Many-to-One)
db.ProblemMessage.belongsTo(db.User, { foreignKey: "userId" });
db.User.hasMany(db.ProblemMessage, { foreignKey: "userId" });

// Task -> ChecklistItem (user) (Many-to-One)
db.Task.hasMany(db.Checklist, { foreignKey: "taskId" });
db.Checklist.belongsTo(db.Task, { foreignKey: "taskId" });

db.ROLES = ["client", "artisan", "moderator", "admin"];

module.exports = db;
