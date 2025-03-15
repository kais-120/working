// models/UserMembre.js
const mongoose = require('mongoose');
const UserBase = require('../UserBase Model');

const userMembreSchema = new mongoose.Schema({
  // Champs spécifiques aux membres peuvent être ajoutés ici
});

module.exports = UserBase.discriminator('UserMembre', userMembreSchema);
