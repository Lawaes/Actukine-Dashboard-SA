/**
 * Classe d'erreur personnalisée pour l'API
 * Permet de standardiser la gestion des erreurs
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware de gestion globale des erreurs
 */
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur';
  
  // Enregistrer l'erreur dans les logs (en production, utilisez un service de logging)
  console.error(`[${new Date().toISOString()}] Erreur: ${message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode
  });

  // Réponse en mode développement - inclure la stack trace
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
      isOperational: err.isOperational || false
    });
  }

  // Réponse en mode production - sans stack trace
  return res.status(statusCode).json({
    success: false,
    message: err.isOperational ? message : 'Une erreur est survenue. L\'équipe technique a été notifiée.'
  });
};

/**
 * Gestionnaire des exceptions non gérées pour éviter de crasher le serveur
 */
export const setupUnhandledExceptionHandlers = () => {
  // Gérer les rejets de promesses non capturés
  process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
    console.error('Rejet de promesse non géré:', reason.message);
    console.error('Stack:', reason.stack);
    // Ne pas terminer le processus, mais enregistrer et surveiller ces erreurs
  });

  // Gérer les exceptions non capturées
  process.on('uncaughtException', (error: Error) => {
    console.error('Exception non capturée:', error.message);
    console.error('Stack:', error.stack);
    // En production, il peut être préférable de redémarrer proprement le serveur
    // après avoir enregistré l'erreur, car l'état de l'application peut être compromis
    if (process.env.NODE_ENV === 'production') {
      console.error('Terminaison du processus à cause d\'une exception non capturée');
      process.exit(1);
    }
  });
}; 