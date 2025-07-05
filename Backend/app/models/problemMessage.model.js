module.exports = (sequelize, Sequelize) => {
  const ProblemMessage = sequelize.define("problem_messages", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: Sequelize.TEXT,
    },
  });
  return ProblemMessage;
};
