const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Pour le cryptage du mot de passe

const mofawadhiyaSchema = mongoose.Schema(
  {
    idsrr: { type: String, required: true },  // Identifiant unique
    nomrr: { type: String, required: true },  // Nom du responsable
    prenomrr: { type: String, required: true },  // Prénom du responsable
    numtelrr: { type: String },  // Numéro de téléphone
    adresseemailrr: { type: String },  // Adresse email
    regionr: { type: String, required: true },  // Région
    password: { type: String, required: true },  // Mot de passe (initialisé à idsrr)
    role: { type: String, default: 'user' }  // Rôle par défaut, vous pouvez le changer (user, admin, etc.)
  },
  { timestamps: true }
);

// Middleware pour définir le mot de passe automatiquement à partir de idsrr
mofawadhiyaSchema.pre('save', async function (next) {
  if (this.isModified('idsrr') || this.isNew) {
    // Cryptage du mot de passe avant de le sauvegarder
    this.password = await bcrypt.hash(this.idsrr, 10);  // Utilise idsrr comme mot de passe
  }
  next();
});

module.exports = mongoose.model("Mofawadhiya", mofawadhiyaSchema);
