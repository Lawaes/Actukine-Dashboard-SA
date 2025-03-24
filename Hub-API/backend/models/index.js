const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Initialisation de Sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import des modèles
db.users = require("./user.model.js")(sequelize, Sequelize);
db.posts = require("./post.model.js")(sequelize, Sequelize);

// Relations entre les modèles
db.users.hasMany(db.posts, { as: "posts" });
db.posts.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

module.exports = db; 