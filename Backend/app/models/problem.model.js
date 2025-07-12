module.exports = (sequelize, Sequelize) => {
  const Problem = sequelize.define("problems", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    phaseLabel: {
      type: Sequelize.STRING,
    },
    taskLabel: {
      type: Sequelize.STRING,
    },
    priority: {
      type: Sequelize.ENUM("Urgent", "Important", "Moyen", "Faible"),
    },
    status: {
      type: Sequelize.ENUM("En cours", "Non résolu", "Résolu"),
    },
    description: {
      type: Sequelize.TEXT,
    },
    images: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  });
  return Problem;
};
