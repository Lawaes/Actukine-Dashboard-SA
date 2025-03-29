// Importation des dépendances
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuration des variables d'environnement
dotenv.config();

// Importation des modèles
const db = require('./models');

// Importation des routes
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Synchroniser la base de données
db.sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('Base de données synchronisée.');
    
    // Créer un utilisateur admin par défaut si en développement
    if (process.env.NODE_ENV === 'development') {
      const User = db.users;
      const bcrypt = require('bcryptjs');
      
      User.findOrCreate({
        where: { email: 'admin@example.com' },
        defaults: {
          username: 'admin',
          password: bcrypt.hashSync('admin123', 8),
          role: 'admin'
        }
      })
        .then(([user, created]) => {
          if (created) {
            console.log('Utilisateur admin créé:', user.email);
          } else {
            console.log('Utilisateur admin existe déjà');
          }
        })
        .catch(err => console.error('Erreur lors de la création de l\'utilisateur admin:', err));
    }
  })
  .catch(err => {
    console.error('Erreur lors de la synchronisation de la base de données:', err);
  });

// Routes de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Hub-Project' });
});

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 