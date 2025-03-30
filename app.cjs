const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
connectDB();
app.use(fileUpload());

app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN ,
  credentials: true, // Autorise les requêtes avec credentials
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization"
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  // Routes d'authentification
  app.use("/api/auth", require("./routes/authRoutes"));

  // Routes des utilisateurs
  app.use("/api/users", require("./routes/userRoutes"));

  // Démarrer le serveur
  app.listen(PORT,"0.0.0.0", () => console.log(`Server started on ${PORT} `));
