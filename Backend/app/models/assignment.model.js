module.exports = (sequelize, Sequelize) => {
  const Assignment = sequelize.define("assignments", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });
  return Assignment;
};
