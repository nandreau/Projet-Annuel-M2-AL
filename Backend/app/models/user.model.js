/*
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};*/

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    mail: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATE
    },
    role: {
      type: Sequelize.JSON
    },
    droit: {
      type: Sequelize.STRING
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: false
  });
  return User;
};
