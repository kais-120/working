const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();
connectDB();
app.use(fileUpload());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Configuration CORS
const corsOptions = {
  origin: "http://localhost:5173", // Mettez ici l'URL exacte du frontend
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // Autorise l’envoi des cookies ou tokens d’authentification
};

app.use(cors(corsOptions));

// Middleware pour parser les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// Démarrage du serveur
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
