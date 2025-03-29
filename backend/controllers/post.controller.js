const db = require("../models");
const Post = db.posts;
const User = db.users;
const Op = db.Sequelize.Op;

// Créer un nouveau post
exports.create = async (req, res) => {
  try {
    // Valider la requête
    if (!req.body.title) {
      return res.status(400).json({ message: "Le titre est requis!" });
    }

    // Vérifier que les utilisateurs responsables existent (si fournis)
    if (req.body.visualResponsibleId) {
      const visualResponsible = await User.findByPk(req.body.visualResponsibleId);
      if (!visualResponsible) {
        return res.status(400).json({ message: "Le responsable visuel spécifié n'existe pas!" });
      }
    }

    if (req.body.reviewResponsibleId) {
      const reviewResponsible = await User.findByPk(req.body.reviewResponsibleId);
      if (!reviewResponsible) {
        return res.status(400).json({ message: "Le responsable de relecture spécifié n'existe pas!" });
      }
    }

    // Créer le post
    const post = await Post.create({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      status: req.body.status || "brouillon",
      publishDate: req.body.publishDate,
      platforms: req.body.platforms || [],
      postType: req.body.postType,
      visualResponsibleId: req.body.visualResponsibleId,
      reviewResponsibleId: req.body.reviewResponsibleId,
      userId: req.userId // Utilisateur connecté (fourni par le middleware d'authentification)
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Une erreur est survenue lors de la création du post."
    });
  }
};

// Récupérer tous les posts
exports.findAll = async (req, res) => {
  try {
    const { title, status, platform, type, userId } = req.query;
    let condition = {};

    // Filtres
    if (title) {
      condition.title = { [Op.iLike]: `%${title}%` };
    }
    if (status) {
      condition.status = status;
    }
    if (platform) {
      condition.platforms = { [Op.contains]: [platform] };
    }
    if (type) {
      condition.postType = type;
    }
    if (userId) {
      condition.userId = userId;
    }

    // Si date actuelle > publishDate et status = 'planifié', mettre à jour status en 'publié'
    const plannedPosts = await Post.findAll({
      where: {
        status: 'planifié',
        publishDate: { [Op.lt]: new Date() }
      }
    });
    
    for (const post of plannedPosts) {
      await post.update({ status: 'publié' });
    }

    const posts = await Post.findAll({
      where: condition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        },
        {
          model: User,
          as: "visualResponsible",
          attributes: ["id", "username"],
          foreignKey: 'visualResponsibleId'
        },
        {
          model: User,
          as: "reviewResponsible",
          attributes: ["id", "username"],
          foreignKey: 'reviewResponsibleId'
        }
      ],
      order: [['publishDate', 'DESC']]
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Une erreur est survenue lors de la récupération des posts."
    });
  }
};

// Récupérer un post par son id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        },
        {
          model: User,
          as: "visualResponsible",
          attributes: ["id", "username"],
          foreignKey: 'visualResponsibleId'
        },
        {
          model: User,
          as: "reviewResponsible",
          attributes: ["id", "username"],
          foreignKey: 'reviewResponsibleId'
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé." });
    }
    
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération du post avec l'id=" + req.params.id
    });
  }
};

// Mettre à jour un post
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Vérifier que les utilisateurs responsables existent (si fournis)
    if (req.body.visualResponsibleId) {
      const visualResponsible = await User.findByPk(req.body.visualResponsibleId);
      if (!visualResponsible) {
        return res.status(400).json({ message: "Le responsable visuel spécifié n'existe pas!" });
      }
    }

    if (req.body.reviewResponsibleId) {
      const reviewResponsible = await User.findByPk(req.body.reviewResponsibleId);
      if (!reviewResponsible) {
        return res.status(400).json({ message: "Le responsable de relecture spécifié n'existe pas!" });
      }
    }
    
    const [updated] = await Post.update(req.body, {
      where: { id: id }
    });
    
    if (updated === 0) {
      return res.status(404).json({
        message: `Impossible de mettre à jour le post avec l'id=${id}. Peut-être que le post n'a pas été trouvé ou le corps de la requête est vide!`
      });
    }
    
    res.status(200).json({
      message: "Le post a été mis à jour avec succès."
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du post avec l'id=" + req.params.id
    });
  }
};

// Supprimer un post
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Post.destroy({
      where: { id: id }
    });
    
    if (deleted === 0) {
      return res.status(404).json({
        message: `Impossible de supprimer le post avec l'id=${id}. Peut-être que le post n'a pas été trouvé!`
      });
    }
    
    res.status(200).json({
      message: "Le post a été supprimé avec succès!"
    });
  } catch (err) {
    res.status(500).json({
      message: "Impossible de supprimer le post avec l'id=" + req.params.id
    });
  }
};

// Récupérer tous les posts assignés à un utilisateur (pour la checklist)
exports.findUserTasks = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    
    const posts = await Post.findAll({
      where: {
        [Op.or]: [
          { visualResponsibleId: userId, visualValidated: false },
          { reviewResponsibleId: userId, reviewValidated: false }
        ]
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username"]
        }
      ],
      order: [['publishDate', 'ASC']]
    });
    
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Une erreur est survenue lors de la récupération des tâches."
    });
  }
};

// Valider une tâche (visuel ou relecture)
exports.validateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const { taskType } = req.body;
    const userId = req.userId;
    
    const post = await Post.findByPk(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé." });
    }
    
    // Vérifier que l'utilisateur est bien responsable de cette tâche
    if (taskType === 'visual' && post.visualResponsibleId !== userId) {
      return res.status(403).json({ message: "Vous n'êtes pas le responsable visuel de ce post." });
    }
    
    if (taskType === 'review' && post.reviewResponsibleId !== userId) {
      return res.status(403).json({ message: "Vous n'êtes pas le responsable de relecture de ce post." });
    }
    
    // Mettre à jour le statut de validation
    const updateData = {};
    if (taskType === 'visual') {
      updateData.visualValidated = true;
    } else if (taskType === 'review') {
      updateData.reviewValidated = true;
    } else {
      return res.status(400).json({ message: "Type de tâche invalide. Utilisez 'visual' ou 'review'." });
    }
    
    await post.update(updateData);
    
    res.status(200).json({
      message: "Tâche validée avec succès!"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Une erreur est survenue lors de la validation de la tâche."
    });
  }
}; 