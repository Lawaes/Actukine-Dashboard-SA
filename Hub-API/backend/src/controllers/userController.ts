import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { ApiError } from '../utils/errors';
import mongoose from 'mongoose';

/**
 * Récupérer tous les utilisateurs
 * @route GET /api/users
 * @access Private/Admin
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password').sort('username');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un utilisateur par son ID
 * @route GET /api/users/:id
 * @access Private/Admin
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError('ID utilisateur invalide', 400);
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new ApiError('Utilisateur non trouvé', 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouvel utilisateur (par admin)
 * @route POST /api/users
 * @access Private/Admin
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, role } = req.body;

    // Vérifier si l'email est déjà utilisé
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new ApiError('Cet email est déjà utilisé.', 400);
    }

    // Vérifier si le nom d'utilisateur est déjà pris
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      throw new ApiError('Ce nom d\'utilisateur est déjà pris.', 400);
    }

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user',
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      message: 'Utilisateur créé avec succès'
    });
  } catch (error: any) {
    // Gérer les erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return next(new ApiError(`Erreur de validation: ${messages.join(', ')}`, 400));
    }
    next(error);
  }
};

/**
 * Mettre à jour un utilisateur
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { username, email, role, avatar } = req.body;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError('ID utilisateur invalide', 400);
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('Utilisateur non trouvé', 404);
    }

    // Si l'email est modifié, vérifier qu'il n'est pas déjà utilisé
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw new ApiError('Cet email est déjà utilisé.', 400);
      }
    }

    // Si le nom d'utilisateur est modifié, vérifier qu'il n'est pas déjà pris
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        throw new ApiError('Ce nom d\'utilisateur est déjà pris.', 400);
      }
    }

    // Mettre à jour les champs fournis
    const fieldsToUpdate: any = {};
    if (username) fieldsToUpdate.username = username;
    if (email) fieldsToUpdate.email = email;
    if (role) fieldsToUpdate.role = role;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Utilisateur mis à jour avec succès'
    });
  } catch (error: any) {
    // Gérer les erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return next(new ApiError(`Erreur de validation: ${messages.join(', ')}`, 400));
    }
    next(error);
  }
};

/**
 * Supprimer un utilisateur
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError('ID utilisateur invalide', 400);
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('Utilisateur non trouvé', 404);
    }

    // Empêcher la suppression de son propre compte via cette route
    if (userId === req.user?._id.toString()) {
      throw new ApiError('Vous ne pouvez pas supprimer votre propre compte via cette route', 400);
    }

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      data: null,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir le profil de l'utilisateur courant
 * @route GET /api/users/profile
 * @access Private
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
 * Mettre à jour le profil de l'utilisateur courant
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { username, email, avatar } = req.body;

    // Si l'email est modifié, vérifier qu'il n'est pas déjà utilisé
    if (email && email !== req.user?.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        throw new ApiError('Cet email est déjà utilisé.', 400);
      }
    }

    // Si le nom d'utilisateur est modifié, vérifier qu'il n'est pas déjà pris
    if (username && username !== req.user?.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        throw new ApiError('Ce nom d\'utilisateur est déjà pris.', 400);
      }
    }

    // Mettre à jour les champs fournis
    const fieldsToUpdate: any = {};
    if (username) fieldsToUpdate.username = username;
    if (email) fieldsToUpdate.email = email;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profil mis à jour avec succès'
    });
  } catch (error: any) {
    // Gérer les erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return next(new ApiError(`Erreur de validation: ${messages.join(', ')}`, 400));
    }
    next(error);
  }
};

/**
 * Mettre à jour le mot de passe de l'utilisateur courant
 * @route PATCH /api/users/profile/password
 * @access Private
 */
export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    // Vérifier que les champs sont remplis
    if (!currentPassword || !newPassword) {
      throw new ApiError('Veuillez fournir le mot de passe actuel et le nouveau mot de passe.', 400);
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError('Utilisateur non trouvé', 404);
    }

    // Vérifier le mot de passe actuel
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError('Mot de passe actuel incorrect', 401);
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    next(error);
  }
}; 