// models/UserLeader.js
const mongoose = require('mongoose');
const UserBase = require('../UserBase Model');

const userLeaderSchema = new mongoose.Schema({
  // Champs spécifiques au leader peuvent être ajoutés ici
});

module.exports = UserBase.discriminator('UserLeader', userLeaderSchema);
