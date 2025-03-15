// models/UserRBR.js
const mongoose = require('mongoose');
const UserBase = require('../UserBase Model'); // Import du modèle UserBase

const userRBRSchema = new mongoose.Schema({
  // Vous pouvez ajouter des champs spécifiques ici si nécessaire
});

// Hérite du modèle UserBase
module.exports = UserBase.discriminator('UserRBR', userRBRSchema);
