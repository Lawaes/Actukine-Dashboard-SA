import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';

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

export default router; 