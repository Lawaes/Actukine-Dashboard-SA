import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post';
import { ApiError } from '../utils/errors';

/**
 * Récupérer toutes les publications (avec filtres optionnels)
 * @route GET /api/posts
 * @access Private
 */
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Construire la requête avec les filtres éventuels
    const query: any = {};

    // Filtre par statut
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filtre par plateforme
    if (req.query.platform) {
      query.platforms = { $in: [req.query.platform] };
    }

    // Filtre par type de post
    if (req.query.type) {
      query.postType = req.query.type;
    }

    // Filtre par recherche (sur le titre et la description)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filtre par auteur
    if (req.query.author) {
      query.authorId = req.query.author;
    }

    // Filtre pour les tâches assignées à un utilisateur
    if (req.query.assignedTo) {
      const userId = req.query.assignedTo;
      query.$or = [
        { visualResponsibleId: userId },
        { reviewResponsibleId: userId }
      ];
    }

    // Exécuter la requête avec population des références
    const posts = await Post.find(query)
      .populate('author', 'username email')
      .populate('visualResponsible', 'username email')
      .populate('reviewResponsible', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une publication par son ID
 * @route GET /api/posts/:id
 * @access Private
 */
export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError('ID de publication invalide', 400);
    }

    // Récupérer la publication avec les références populées
    const post = await Post.findById(postId)
      .populate('author', 'username email')
      .populate('visualResponsible', 'username email')
      .populate('reviewResponsible', 'username email');

    // Vérifier si la publication existe
    if (!post) {
      throw new ApiError('Publication non trouvée', 404);
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle publication
 * @route POST /api/posts
 * @access Private
 */
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ajouter l'ID de l'auteur (l'utilisateur connecté)
    req.body.authorId = req.user?._id;

    // Créer la publication
    const post = await Post.create(req.body);

    // Renvoyer la publication créée avec les références populées
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username email')
      .populate('visualResponsible', 'username email')
      .populate('reviewResponsible', 'username email');

    res.status(201).json({
      success: true,
      data: populatedPost,
      message: 'Publication créée avec succès'
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
 * Mettre à jour une publication
 * @route PUT /api/posts/:id
 * @access Private
 */
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError('ID de publication invalide', 400);
    }

    // Récupérer la publication pour vérification
    const post = await Post.findById(postId);

    // Vérifier si la publication existe
    if (!post) {
      throw new ApiError('Publication non trouvée', 404);
    }

    // Vérifier si l'utilisateur est l'auteur de la publication ou un administrateur
    if (post.authorId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      throw new ApiError('Vous n\'êtes pas autorisé à modifier cette publication', 403);
    }

    // Mettre à jour la publication
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('author', 'username email')
      .populate('visualResponsible', 'username email')
      .populate('reviewResponsible', 'username email');

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: 'Publication mise à jour avec succès'
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
 * Supprimer une publication
 * @route DELETE /api/posts/:id
 * @access Private
 */
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError('ID de publication invalide', 400);
    }

    // Récupérer la publication pour vérification
    const post = await Post.findById(postId);

    // Vérifier si la publication existe
    if (!post) {
      throw new ApiError('Publication non trouvée', 404);
    }

    // Vérifier si l'utilisateur est l'auteur de la publication ou un administrateur
    if (post.authorId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      throw new ApiError('Vous n\'êtes pas autorisé à supprimer cette publication', 403);
    }

    // Supprimer la publication
    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      data: null,
      message: 'Publication supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour le statut d'une publication
 * @route PATCH /api/posts/:id/status
 * @access Private
 */
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;
    const { status } = req.body;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError('ID de publication invalide', 400);
    }

    // Vérifier si le statut est valide
    if (!['brouillon', 'planifié', 'publié'].includes(status)) {
      throw new ApiError('Statut invalide. Les statuts acceptés sont: brouillon, planifié, publié', 400);
    }

    // Récupérer la publication pour vérification
    const post = await Post.findById(postId);

    // Vérifier si la publication existe
    if (!post) {
      throw new ApiError('Publication non trouvée', 404);
    }

    // Vérifier si l'utilisateur est l'auteur de la publication ou un administrateur
    if (post.authorId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      throw new ApiError('Vous n\'êtes pas autorisé à modifier cette publication', 403);
    }

    // Mettre à jour le statut
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { status },
      { new: true }
    )
      .populate('author', 'username email')
      .populate('visualResponsible', 'username email')
      .populate('reviewResponsible', 'username email');

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: `Statut mis à jour: ${status}`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Valider une tâche (visuel ou relecture)
 * @route PATCH /api/posts/:id/validate
 * @access Private
 */
export const validateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;
    const { taskType } = req.body;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new ApiError('ID de publication invalide', 400);
    }

    // Vérifier si le type de tâche est valide
    if (!['visual', 'review'].includes(taskType)) {
      throw new ApiError('Type de tâche invalide. Les types acceptés sont: visual, review', 400);
    }

    // Récupérer la publication pour vérification
    const post = await Post.findById(postId);

    // Vérifier si la publication existe
    if (!post) {
      throw new ApiError('Publication non trouvée', 404);
    }

    // Vérifier si l'utilisateur est le responsable assigné pour cette tâche
    if (
      (taskType === 'visual' && post.visualResponsibleId?.toString() !== req.user?._id.toString()) ||
      (taskType === 'review' && post.reviewResponsibleId?.toString() !== req.user?._id.toString())
    ) {
      throw new ApiError('Vous n\'êtes pas autorisé à valider cette tâche', 403);
    }

    // Mettre à jour le statut de validation
    const updateData = taskType === 'visual' 
      ? { visualValidated: true } 
      : { reviewValidated: true };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      updateData,
      { new: true }
    )
      .populate('author', 'username email')
      .populate('visualResponsible', 'username email')
      .populate('reviewResponsible', 'username email');

    res.status(200).json({
      success: true,
      data: updatedPost,
      message: `Tâche ${taskType === 'visual' ? 'visuelle' : 'de relecture'} validée avec succès`
    });
  } catch (error) {
    next(error);
  }
}; 