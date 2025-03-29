import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

/**
 * Middleware pour gérer les erreurs
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Erreur détectée:', err);

  // Erreur de Cast MongoDB (ObjectId invalide)
  if (err.name === 'CastError') {
    const message = `Ressource non trouvée avec l'id: ${err.value}`;
    error = new ApiError(message, 404);
  }

  // Erreur de validation MongoDB
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new ApiError(message, 400);
  }

  // Erreur de duplicate MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `La valeur '${value}' pour le champ '${field}' est déjà utilisée.`;
    error = new ApiError(message, 400);
  }

  // Erreur de syntaxe JSON
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    error = new ApiError('Erreur de syntaxe JSON. Veuillez vérifier votre requête.', 400);
  }

  // Réponse au client
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erreur serveur interne',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}; 