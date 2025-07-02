module.exports = (sequelize, Sequelize) => {
  const ProblemMessage = sequelize.define('problem_messages', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATE
    },
    content: {
      type: Sequelize.TEXT
    }
  }, {
    timestamps: false
  });
  return ProblemMessage;
};
