import express from 'express';
import { register, login, logout, refreshToken } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Routes privées - nécessitent authentification
router.use(authenticate);
router.post('/logout', logout);

export default router; 