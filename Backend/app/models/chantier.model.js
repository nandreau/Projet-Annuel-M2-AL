module.exports = (sequelize, Sequelize) => {
  const Chantier = sequelize.define('chantiers', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    start: {
      type: Sequelize.DATE
    },
    end: {
      type: Sequelize.DATE
    },
    progress: {
      type: Sequelize.FLOAT
    },
    images: {
      type: Sequelize.JSON,
      allowNull: true
    },
    intervenants: {
      type: Sequelize.JSON
    }
  });
  return Chantier;
};
