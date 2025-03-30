const UserBase = require('../models/UserBase Model');
const UserRBR = require('../models/users/userrbrModel');
const UserLeader = require('../models/users/userLeaderModel');
const UserMembre = require('../models/users/userMembreModel');
const UserAdmin = require('../models/users/userAdmin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fonction pour créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { idscout, nom, prenom, numtel, adresseemail, region, role, mot_de_passe , groupe } = req.body;

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
      groupe,
      mot_de_passe: hashedPassword,
    };

    let user;
    switch (role) {
      case 'admin':
        user = new Useradmin(userData);
        break;
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

const getUsersLeader = async (req, res) => {
  try {
    const users = await UserLeader.find(); // Trouver tous les utilisateurs dans UserRBR
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Erreur serveur :", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
const getUsersMembre = async (req, res) => {
  try {
    const users = await UserMembre.find(); // Trouver tous les utilisateurs dans UserRBR
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Erreur serveur :", error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { createUser, getUsersRBR , getUsersLeader , getUsersMembre };
