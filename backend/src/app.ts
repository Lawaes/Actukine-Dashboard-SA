import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { config } from './config';
import { Request, Response, NextFunction } from 'express';

// Création de l'application Express
const app = express();

// Configuration des middlewares
app.use(helmet()); // Sécurité HTTP
app.use(compression()); // Compression des réponses
app.use(morgan('dev')); // Logging des requêtes
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
})); // CORS
app.use(express.json()); // Parsing du JSON
app.use(express.urlencoded({ extended: true })); // Parsing des URL encoded
app.use(cookieParser()); // Parsing des cookies

// Routes de l'API
app.use('/api', routes);

// Route 404
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route introuvable'
  });
});

// Middleware de gestion des erreurs
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connexion à MongoDB établie');
  } catch (error) {
    console.error('Erreur lors de la connexion à MongoDB:', error);
    process.exit(1);
  }
};

// Démarrage du serveur
const startServer = async () => {
  try {
    await connectDB();
    const PORT = config.port || 5000;
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des erreurs non gérées
process.on('unhandledRejection', (err) => {
  console.error('Rejet de promesse non géré:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Exception non gérée:', err);
  process.exit(1);
});

export { app, startServer }; 