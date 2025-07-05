module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("tasks", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    done: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    dueDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    doneDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    images: {
      type: Sequelize.JSON,
      allowNull: true,
    },
  });
  return Task;
};
