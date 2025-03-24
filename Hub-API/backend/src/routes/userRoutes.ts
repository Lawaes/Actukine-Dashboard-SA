import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  updatePassword
} from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';

const router = express.Router();

// Routes publiques
// Aucune route publique pour l'instant

// Routes privées - nécessitent authentification
router.use(authenticate);

// Routes pour le profil de l'utilisateur connecté
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.patch('/profile/password', updatePassword);

// Routes privées - nécessitent authentification ET autorisation d'administrateur
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

export default router; 