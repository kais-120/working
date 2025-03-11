const mongoose = require("mongoose");

const mofawadhiyaSchema = new mongoose.Schema({
  idsrr: { type: String, required: true, unique: true },
  nomrr: { type: String, required: true },
  prenomrr: { type: String, required: true },
  numtelrr: { type: String },
  adresseemailrr: { type: String, unique: true },
  regionr: { type: String },
  password: { type: String, required: true }  // 🔥 Le mot de passe est obligatoire
});

const Mofawadhiya = mongoose.model("Mofawadhiya", mofawadhiyaSchema);
module.exports = Mofawadhiya;
