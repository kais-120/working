const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController'); // Assurez-vous que authController existe et contient la logique du login

// Route pour la connexion (login)
router.post('/login', login); // Utilise la fonction login du contrôleur d'authentification


module.exports = router;
