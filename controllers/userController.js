const bcrypt = require("bcrypt");
const Mofawadhiya = require("../models/mofawadhiyaModel"); // Assure-toi d'importer ton modèle

exports.createMofawadhiya = async (req, res) => {
  try {
    console.log("Requête reçue :", req.body); // 🔍 Vérifier les données envoyées

    const { idsrr, nomrr, prenomrr, numtelrr, adresseemailrr, regionr } = req.body;

    if (!idsrr || !nomrr || !prenomrr) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    // Générer le mot de passe basé sur idsrr
    const hashedPassword = bcrypt.hashSync(idsrr, 10); 

    console.log("Mot de passe généré :", hashedPassword); // 🔍 Vérifier si le password est généré

    // Créer l'utilisateur avec le mot de passe
    const newMofawadhiya = new Mofawadhiya({
      idsrr,
      nomrr,
      prenomrr,
      numtelrr,
      adresseemailrr,
      regionr,
      password: hashedPassword // 🔥 Ici, on ajoute le mot de passe
    });

    await newMofawadhiya.save();

    res.status(201).json({ message: "Mofawadhiya créé avec succès", data: newMofawadhiya });
  } catch (err) {
    console.error("Erreur dans createMofawadhiya:", err);
    res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
  }
};

// 🚀 Récupérer tous les utilisateurs Mofawadhiya
exports.getAllMofawadhiya = async (req, res) => {
  try {
    const mofawadhiyaList = await Mofawadhiya.find();
    res.status(200).json(mofawadhiyaList);
  } catch (err) {
    console.error("Erreur dans getAllMofawadhiya:", err);
    res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
  }
};

// 🚀 Récupérer un utilisateur par son ID
exports.getMofawadhiyaById = async (req, res) => {
  try {
    const { id } = req.params;
    const mofawadhiya = await Mofawadhiya.findById(id);
    if (!mofawadhiya) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(mofawadhiya);
  } catch (err) {
    console.error("Erreur dans getMofawadhiyaById:", err);
    res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
  }
};

// 🚀 Mettre à jour un utilisateur
exports.updateMofawadhiya = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMofawadhiya = await Mofawadhiya.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMofawadhiya) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur mis à jour", data: updatedMofawadhiya });
  } catch (err) {
    console.error("Erreur dans updateMofawadhiya:", err);
    res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
  }
};

// 🚀 Supprimer un utilisateur
exports.deleteMofawadhiya = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMofawadhiya = await Mofawadhiya.findByIdAndDelete(id);
    if (!deletedMofawadhiya) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error("Erreur dans deleteMofawadhiya:", err);
    res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
  }
};
