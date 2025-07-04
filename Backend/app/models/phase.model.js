module.exports = (sequelize, Sequelize) => {
  const Phase = sequelize.define('phases', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    progress: {
      type: Sequelize.FLOAT
    }
  });
  return Phase;
};
