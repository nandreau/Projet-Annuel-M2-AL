module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define(
    "refresh_tokens",
    {
      token: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      revokedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    { timestamps: false },
  );

  return RefreshToken;
};
