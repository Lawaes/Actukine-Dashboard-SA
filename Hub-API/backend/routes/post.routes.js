const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Toutes les routes pour les posts nécessitent une authentification
router.use(authMiddleware.verifyToken);

// Routes accessibles aux membres et admins
router.get("/", postController.findAll);
router.get("/tasks", postController.findUserTasks); // Tâches assignées à l'utilisateur connecté
router.get("/:id", postController.findOne);
router.post("/", postController.create);
router.put("/:id/validate", postController.validateTask); // Valider une tâche

// Routes nécessitant d'être propriétaire ou admin
router.put("/:id", authMiddleware.isOwnerOrAdmin, postController.update);
router.delete("/:id", authMiddleware.isOwnerOrAdmin, postController.delete);

module.exports = router; 