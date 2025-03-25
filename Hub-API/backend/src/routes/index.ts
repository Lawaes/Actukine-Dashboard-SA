import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import { Request, Response } from 'express';

const router = express.Router();

// Routes de l'API
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

// Route racine de l'API
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Hub Social - Bienvenue',
    version: '1.0.0'
  });
});

router.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

export default router; 