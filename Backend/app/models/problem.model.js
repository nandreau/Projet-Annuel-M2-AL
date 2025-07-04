module.exports = (sequelize, Sequelize) => {
  const Problem = sequelize.define('problems', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING
    },
    urgency: {
      type: Sequelize.ENUM('Urgent', 'Moyen', 'Faible')
    },
    chantier: {
      type: Sequelize.STRING
    },
    phase: {
      type: Sequelize.STRING
    },
    task: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM('En cours', 'Non résolu', 'Résolu')
    },
    description: {
      type: Sequelize.TEXT
    },
    images: {
      type: Sequelize.JSON,
      allowNull: true
    }
  });
  return Problem;
};
