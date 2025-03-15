const express = require('express');
const { createUser, loginUser, getUsersRBR } = require('../controllers/userContorller');  // Corrigez le nom ici

const router = express.Router();

// Route pour créer un utilisateur
router.post('/add', createUser);

// Route pour connecter un utilisateur
router.post('/login', loginUser);

// Route pour récupérer les utilisateurs du modèle UserRBR
router.get('/rbr', getUsersRBR);

module.exports = router;
