module.exports = (sequelize, Sequelize) => {
  const Chantier = sequelize.define("chantiers", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    start: {
      type: Sequelize.DATE,
    },
    end: {
      type: Sequelize.DATE,
    },
    images: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  });
  return Chantier;
};
