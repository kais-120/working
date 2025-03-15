// models/UserBase.js
const mongoose = require('mongoose');

const userBaseSchema = new mongoose.Schema({
  idscout: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  numtel: {
    type: String,
    required: true,
  },
  adresseemail: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  mot_de_passe: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('UserBase', userBaseSchema);
