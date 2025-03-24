module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [['admin', 'user', 'freelance']]
      }
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  });

  return User;
}; 