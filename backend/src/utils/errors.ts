import { Request, Response, NextFunction } from 'express';

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
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
};

/**
 * Gestionnaire des exceptions non gérées pour éviter de crasher le serveur
 */
export const setupUnhandledExceptionHandlers = () => {
  // Gérer les rejets de promesses non capturés
  process.on('unhandledRejection', (reason: Error) => {
    console.error('Rejet de promesse non géré:', reason.message);
    console.error('Stack:', reason.stack);
  });

  // Gérer les exceptions non capturées
  process.on('uncaughtException', (error: Error) => {
    console.error('Exception non capturée:', error.message);
    console.error('Stack:', error.stack);
    if (process.env.NODE_ENV === 'production') {
      console.error('Terminaison du processus à cause d\'une exception non capturée');
      process.exit(1);
    }
  });
};

export const asyncHandler = (fn: Function) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(_req, res, next)).catch(next);
  };
}; 