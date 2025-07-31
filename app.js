require("dotenv").config();
require("colors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const server = require('./server');
const AuthenticateAPI = require("./middleware/AuthenticateAPI");
const sequelize = require("./config/db");
require("./models/index")


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// database
sequelize.sync();

sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.error("DB Error:", err));

  // cors Middlewares
app.use(express.json());
app.use(cors());

// === Déclaration des routes ===
app.use("/api/v1",AuthenticateAPI,server)

// === Lancement du serveur ===
app.listen(PORT ,() => {
  console.log(`Serveur démarré sur le port ${PORT}`.green.bold);
});
module.exports = app;