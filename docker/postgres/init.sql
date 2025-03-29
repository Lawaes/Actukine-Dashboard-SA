-- Création de la base de données
CREATE DATABASE hub_db;

-- Connexion à la base de données
\connect hub_db;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables et séquences seront créées par Sequelize lors du démarrage de l'application

-- Création d'un utilisateur admin par défaut (pour le développement)
-- Le mot de passe sera haché par l'application, donc on ne l'insère pas directement ici 