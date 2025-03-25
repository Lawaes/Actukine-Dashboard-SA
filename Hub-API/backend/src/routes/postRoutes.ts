import express from 'express';
import { authenticate } from '../middlewares/auth';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  updateStatus,
  validateTask
} from '../controllers/postController';

const router = express.Router();

// Routes privées - nécessitent authentification
router.use(authenticate);

// Routes accessibles à tous les utilisateurs authentifiés
router.route('/')
  .get(getPosts)
  .post(createPost);

router.route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

router.patch('/:id/status', updateStatus);
router.patch('/:id/validate', validateTask);

export default router; 