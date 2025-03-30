const express = require('express');
const { createUser, loginUser, getUsersRBR, getUsersLeader, getUsersMembre } = require('../controllers/userContorller');  // Corrigez le nom ici

const router = express.Router();

// Route pour créer un utilisateur
router.post('/add', createUser);

// Route pour récupérer les utilisateurs du modèle UserRBR
router.get('/rbr', getUsersRBR);

router.get('/leader', getUsersLeader);

router.get('/membre', getUsersMembre);

module.exports = router;
