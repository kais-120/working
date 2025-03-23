const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();

// Connecter à la base de données
connectDB();

// Middleware pour la gestion des fichiers téléchargés
app.use(fileUpload());

// Servir les fichiers statiques (par exemple pour les images)
app.use(express.static(path.join(__dirname, "public")));

// Configuration des options CORS
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // Pour envoyer des cookies ou des tokens d'authentification
};
app.use(cors(corsOptions));

// Middleware pour analyser les corps des requêtes (JSON et URL encodé)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes d'authentification
app.use("/api/auth", require("./routes/authRoutes")); // Ajout des routes d'authentification ici

// Routes des utilisateurs
app.use("/api/users", require("./routes/userRoutes")); // Vous avez déjà votre route pour les utilisateurs

// Démarrage du serveur
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
