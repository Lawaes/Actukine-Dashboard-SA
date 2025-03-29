import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuration de la base de données
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/hub-social',
  
  // Configuration du JWT
  jwtSecret: process.env.JWT_SECRET || 'votre_secret_jwt_super_securise',
  jwtExpire: process.env.JWT_EXPIRE || '24h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'votre_secret_refresh_jwt_super_securise',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  
  // Configuration CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Configuration des cookies
  cookieExpire: parseInt(process.env.COOKIE_EXPIRE || '7'),  // 7 jours par défaut
  
  // Configuration de la sécurité
  bcryptSalt: parseInt(process.env.BCRYPT_SALT || '10'),
}; 