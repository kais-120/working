// controllers/userController.js
const UserBase = require('../models/UserBase Model');
const UserRBR = require('../models/users/userrbrModel');
const UserLeader = require('../models/users/userLeaderModel');
const UserMembre = require('../models/users/userMembreModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fonction pour créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { idscout, nom, prenom, numtel, adresseemail, region, role, mot_de_passe } = req.body;

    // Vérification des champs obligatoires
    if (!idscout || !nom || !prenom || !numtel || !adresseemail || !region || !role || !mot_de_passe) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await UserBase.findOne({ adresseemail });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hacher le mot de passe
    if (!mot_de_passe.trim()) {
      return res.status(400).json({ message: "Le mot de passe ne peut pas être vide." });
    }
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Préparer l'utilisateur
    const userData = {
      idscout,
      nom,
      prenom,
      numtel,
      adresseemail,
      region,
      role,
      mot_de_passe: hashedPassword,
    };

    let user;
    switch (role) {
      case 'rbr':
        user = new UserRBR(userData);
        break;
      case 'leader':
        user = new UserLeader(userData);
        break;
      case 'membre':
        user = new UserMembre(userData);
        break;
      default:
        return res.status(400).json({ message: 'Rôle invalide.' });
    }

    // Sauvegarder l'utilisateur
    await user.save();

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: "Utilisateur créé avec succès.", token, user });
  } catch (error) {
    console.error("Erreur serveur :", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Fonction pour récupérer les utilisateurs du modèle UserRBR
const getUsersRBR = async (req, res) => {
  try {
    const users = await UserRBR.find(); // Trouver tous les utilisateurs dans UserRBR
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Erreur serveur :", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Fonction pour l'authentification de l'utilisateur (login)
const loginUser = async (req, res) => {
  try {
    const { adresseemail, mot_de_passe } = req.body;

    if (!adresseemail || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // Rechercher l'utilisateur dans les différents rôles
    let user = await UserRBR.findOne({ adresseemail }) ||
               await UserLeader.findOne({ adresseemail }) ||
               await UserMembre.findOne({ adresseemail });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: "Connexion réussie.", token, user });
  } catch (error) {
    console.error("Erreur serveur :", error.message);
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
};

module.exports = { createUser, getUsersRBR, loginUser };
