module.exports = (sequelize, Sequelize) => {
  const Checklist = sequelize.define("checklist", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    done: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return Checklist;
};
