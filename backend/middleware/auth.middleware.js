const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.users;

// Vérifier si le token est valide
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({
      message: "Aucun token fourni!"
    });
  }

  // Enlever le préfixe "Bearer" s'il existe
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Non autorisé!"
      });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

// Vérifier si l'utilisateur est admin
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === "admin") {
      next();
      return;
    }

    res.status(403).json({
      message: "Accès refusé! - Rôle Admin requis!"
    });
  });
};

// Vérifier si l'utilisateur est membre ou admin
isMemberOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.role === "admin" || user.role === "user") {
      next();
      return;
    }

    res.status(403).json({
      message: "Accès refusé! - Rôle Membre ou Admin requis!"
    });
  });
};

// Vérifier si l'utilisateur est le propriétaire de la ressource
isOwnerOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    // Les admins peuvent tout faire
    if (user.role === "admin") {
      next();
      return;
    }
    
    // Si on a un postId dans les paramètres, vérifier que l'utilisateur est le propriétaire du post
    if (req.params.id) {
      const Post = db.posts;
      const post = await Post.findByPk(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: "Post non trouvé!" });
      }
      
      if (post.userId === req.userId) {
        next();
        return;
      }
    }
    
    res.status(403).json({
      message: "Accès refusé! - Vous n'êtes pas autorisé à modifier cette ressource!"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Une erreur est survenue lors de la vérification des permissions."
    });
  }
};

const authMiddleware = {
  verifyToken,
  isAdmin,
  isMemberOrAdmin,
  isOwnerOrAdmin
};

module.exports = authMiddleware; 