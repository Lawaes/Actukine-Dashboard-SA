const db = require("../models");
const User = db.users;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Créer un nouvel utilisateur
exports.create = async (req, res) => {
  try {
    // Valider la requête
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Le nom d'utilisateur, l'email et le mot de passe sont requis!" });
    }

    // Hacher le mot de passe
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // Créer l'utilisateur
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || "user"
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Une erreur est survenue lors de la création de l'utilisateur."
    });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    // Valider la requête
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "L'email et le mot de passe sont requis!" });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email: req.body.email } });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier le mot de passe
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    
    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Mot de passe incorrect!"
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(403).json({
        message: "Compte désactivé, veuillez contacter l'administrateur."
      });
    }

    // Générer un token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 heures
    });

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Une erreur est survenue lors de la connexion."
    });
  }
};

// Récupérer tous les utilisateurs
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Une erreur est survenue lors de la récupération des utilisateurs."
    });
  }
};

// Récupérer un utilisateur par son id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'role', 'isActive', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
    
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur avec l'id=" + req.params.id
    });
  }
};

// Mettre à jour un utilisateur
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Si le mot de passe est fourni, le hacher
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 8);
    }
    
    const [updated] = await User.update(req.body, {
      where: { id: id }
    });
    
    if (updated === 0) {
      return res.status(404).json({
        message: `Impossible de mettre à jour l'utilisateur avec l'id=${id}. Peut-être que l'utilisateur n'a pas été trouvé ou le corps de la requête est vide!`
      });
    }
    
    res.status(200).json({
      message: "L'utilisateur a été mis à jour avec succès."
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur avec l'id=" + req.params.id
    });
  }
};

// Supprimer un utilisateur
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await User.destroy({
      where: { id: id }
    });
    
    if (deleted === 0) {
      return res.status(404).json({
        message: `Impossible de supprimer l'utilisateur avec l'id=${id}. Peut-être que l'utilisateur n'a pas été trouvé!`
      });
    }
    
    res.status(200).json({
      message: "L'utilisateur a été supprimé avec succès!"
    });
  } catch (err) {
    res.status(500).json({
      message: "Impossible de supprimer l'utilisateur avec l'id=" + req.params.id
    });
  }
}; 