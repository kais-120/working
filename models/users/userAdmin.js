// models/UserLeader.js
const mongoose = require('mongoose');
const UserBase = require('../UserBase Model');

const userAdminSchema = new mongoose.Schema({
  // Champs spécifiques au admin peuvent être ajoutés ici
});

module.exports = UserBase.discriminator('UserAdmin', userAdminSchema);
