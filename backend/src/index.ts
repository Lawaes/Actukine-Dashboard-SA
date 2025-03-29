import { startServer } from './app';
import { setupUnhandledExceptionHandlers } from './utils/errors';

// Configurer les gestionnaires d'exceptions non gérées
setupUnhandledExceptionHandlers();

// Démarrer le serveur
startServer(); 