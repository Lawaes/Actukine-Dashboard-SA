import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { ApiError } from '../utils/errors';

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Interface pour le contenu décodé du token JWT
interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Middleware d'authentification - vérifie si l'utilisateur est connecté
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer le token du header Authorization ou des cookies
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Format Bearer token
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.authToken) {
      // Format cookie
      token = req.cookies.authToken;
    }

    // Vérifier si le token existe
    if (!token) {
      return next(new ApiError('Accès non autorisé. Veuillez vous connecter.', 401));
    }

    // Vérifier le token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'jwt-secret-key'
    ) as DecodedToken;

    // Récupérer l'utilisateur à partir du token décodé
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError('Utilisateur non trouvé. Token invalide.', 401));
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return next(new ApiError('Accès non autorisé. Token invalide.', 401));
  }
};

/**
 * Middleware de vérification de rôle - vérifie si l'utilisateur a le rôle requis
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Accès non autorisé. Vous devez être connecté.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(`Accès interdit. Vous n'avez pas les autorisations nécessaires.`, 403));
    }

    next();
  };
};

// Garder les anciennes exportations pour la compatibilité avec le code existant
export const auth = authenticate;
export const checkRole = authorize; 