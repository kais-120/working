// models/UserLeader.js
const mongoose = require('mongoose');
const UserBase = require('../UserBase Model');

const userLeaderSchema = new mongoose.Schema({
  groupe: { 
    type: String, 
    required: true,  // Par exemple, rendre ce champ obligatoire
    trim: true       // Supprime les espaces avant et après la chaîne
  },
});

module.exports = UserBase.discriminator('UserLeader', userLeaderSchema);
