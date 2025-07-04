module.exports = (sequelize, Sequelize) => {
  const TaskPlanning = sequelize.define('task_plannings', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });
  return TaskPlanning;
};
