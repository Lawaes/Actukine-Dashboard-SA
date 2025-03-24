module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "brouillon",
      validate: {
        isIn: [['brouillon', 'planifié', 'publié']]
      }
    },
    publishDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    platforms: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    },
    postType: {
      type: Sequelize.STRING,
      allowNull: true
    },
    visualResponsibleId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewResponsibleId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    visualValidated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    reviewValidated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  return Post;
}; 