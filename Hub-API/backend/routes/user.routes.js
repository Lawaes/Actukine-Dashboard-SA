const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Route publique pour s'inscrire
router.post("/register", userController.create);

// Route publique pour se connecter
router.post("/login", userController.login);

// Routes protégées par authentification
router.use(authMiddleware.verifyToken);

// Routes accessibles aux membres et admins
router.get("/profile", userController.findOne); // Obtenir son propre profil

// Routes accessibles seulement aux admins
router.use(authMiddleware.isAdmin);
router.get("/", userController.findAll);
router.get("/:id", userController.findOne);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

module.exports = router; 