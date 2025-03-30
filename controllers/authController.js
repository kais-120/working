const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserBase Model"); // Assurez-vous que le modèle User est correctement configuré

// Fonction pour gérer la connexion de l'utilisateur
const login = async (req, res) => {
  const { idscout, password } = req.body;

  try {
    console.log("Données reçues:", req.body); // Log pour débogage

    const user = await User.findOne({ idscout });

    if (!user) {
      return res.status(400).json({ message: "Identifiant ou mot de passe incorrect" });
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await bcrypt.compare(password, user.mot_de_passe);

    if (!isMatch) {
      return res.status(400).json({ message: "Identifiant ou mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, idscout: user.idscout, nom: user.nom , prenom:user.prenom , role: user.role }, // Inclure l'id et l'idscout dans le payload du token
      process.env.JWT_SECRET || "votre_clé_secrète", // Clé secrète (à mettre dans un fichier .env pour la sécurité)
      { expiresIn: "12h" } // Expiration du token
    );

    // Retourner le token avec les données de l'utilisateur
    res.json({
      message: "Authentification réussie",
      user: {
        id: user._id,
        idscout: user.idscout,
        nom: user.nom, // Inclure les autres données de l'utilisateur si nécessaire
        prenom: user.prenom,
        role: user.role,
        region: user.region, 
        groupe: user.groupe
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};

module.exports = { login };
