module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define('refresh_tokens', {
    token: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    expiryDate: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, { timestamps: false });

  return RefreshToken;
};
