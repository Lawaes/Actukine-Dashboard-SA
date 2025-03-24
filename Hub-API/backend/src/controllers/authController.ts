import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { ApiError } from '../utils/errors';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// Durée d'expiration du cookie (30 jours)
const TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 jours en millisecondes

// Interface pour le contenu décodé du token JWT
interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Controller pour l'inscription
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'email est déjà utilisé
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError('Cet email est déjà utilisé. Veuillez en choisir un autre.', 400);
    }

    // Vérifier si le nom d'utilisateur est déjà pris
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new ApiError('Ce nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.', 400);
    }

    // Créer un nouvel utilisateur
    const user = await User.create({
      username,
      email,
      password,
      // Par défaut, le rôle est 'user'
    });

    // Répondre avec succès, sans envoyer le mot de passe
    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      message: 'Compte créé avec succès! Vous pouvez maintenant vous connecter.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour la connexion
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Vérifier si les champs sont remplis
    if (!email || !password) {
      throw new ApiError('Veuillez fournir un email et un mot de passe.', 400);
    }

    // Trouver l'utilisateur par email et inclure le mot de passe pour la vérification
    const user = await User.findOne({ email }).select('+password');
    
    // Vérifier si l'utilisateur existe
    if (!user) {
      throw new ApiError('Email ou mot de passe incorrect.', 401);
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError('Email ou mot de passe incorrect.', 401);
    }

    // Générer le token JWT
    const token = user.generateAuthToken();

    // Configuration des options pour le cookie
    const cookieOptions = {
      expires: new Date(Date.now() + TOKEN_EXPIRY),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Utiliser https en production
      sameSite: 'strict' as const, // Protection CSRF
    };

    // Envoyer le token dans un cookie
    res.cookie('authToken', token, cookieOptions);

    // Renvoyer les infos de l'utilisateur sans le mot de passe
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      },
      message: 'Connexion réussie.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour rafraîchir le token
 * @route POST /api/auth/refresh-token
 * @access Public
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer le refresh token
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw new ApiError('Refresh token non fourni', 401);
    }

    // Vérifier et décoder le refresh token
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.jwtRefreshSecret
      ) as DecodedToken;

      // Récupérer l'utilisateur
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ApiError('Utilisateur non trouvé', 401);
      }

      // Générer un nouveau token d'accès
      const newAccessToken = user.generateAuthToken();

      // Renvoyer le nouveau token
      res.status(200).json({
        success: true,
        data: {
          token: newAccessToken
        },
        message: 'Token rafraîchi avec succès'
      });
    } catch (err) {
      throw new ApiError('Refresh token invalide ou expiré', 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour récupérer les infos de l'utilisateur actuel
 * @route GET /api/auth/me
 * @access Private
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // L'utilisateur est déjà attaché à la requête par le middleware d'auth
    const user = req.user as IUser;
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller pour la déconnexion
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Effacer le cookie d'authentification
    res.cookie('authToken', '', {
      expires: new Date(0),
      httpOnly: true
    });

    // Effacer aussi le refresh token s'il existe
    if (req.cookies?.refreshToken) {
      res.cookie('refreshToken', '', {
        expires: new Date(0),
        httpOnly: true
      });
    }

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie.'
    });
  } catch (error) {
    next(error);
  }
}; 