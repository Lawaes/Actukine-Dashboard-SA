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

/**
 * Middleware d'authentification - vérifie si l'utilisateur est connecté
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new ApiError('Non authentifié', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new ApiError('Utilisateur non trouvé', 404);
    }

    res.locals.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware de vérification de rôle - vérifie si l'utilisateur a le rôle requis
 */
export const authorize = (...roles: string[]) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
      return next(new ApiError('Non authentifié', 401));
    }

    if (!roles.includes(res.locals.user.role)) {
      return next(new ApiError('Accès non autorisé', 403));
    }

    next();
  };
};

// Garder les anciennes exportations pour la compatibilité avec le code existant
export const auth = authenticate;
export const checkRole = authorize; 