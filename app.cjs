const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Charger les variables d'environnement
dotenv.config();

// Importation des routes utilisateur
const userRoutes = require("./routes/userRoutes");

// Initialisation de l'application
const app = express();

// Connexion à la base de données
connectDB();

// Middleware pour le téléchargement de fichiers
app.use(fileUpload());

// Servir des fichiers statiques depuis le répertoire "public"
app.use(express.static(path.join(__dirname, "public")));

// Configuration des options CORS
const corsOptions = {
  origin: (origin, callback) => {
    console.log("🌐 Origine de la requête:", origin);

    if (process.env.NODE_ENV === "development") {
      console.log("🔧 Mode Développement - CORS autorisé pour localhost");
      if (!origin || origin.includes("localhost")) {
        return callback(null, true);
      }
    }

    const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
    console.log("✅ Origine autorisée:", allowedOrigin);

    if (!origin || origin === allowedOrigin || allowedOrigin === "*") {
      return callback(null, true);
    }

    return callback(new Error("🚫 CORS non autorisé"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware pour parser les requêtes JSON et URL encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utilisation des routes utilisateur
app.use("/api/users", userRoutes);

// Gérer les erreurs 404 (route non trouvée)
app.use((req, res, next) => {
  res.status(404).json({ message: "❌ Route non trouvée" });
});

// Middleware de gestion des erreurs global
app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur:", err.message);
  res.status(500).json({ message: "💥 Erreur interne du serveur" });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`.cyan.underline);
});
