const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Création d'un Mofawadhiya
router.post('/create', userController.createMofawadhiya);

// Connexion d'un utilisateur (si tu veux l'ajouter plus tard)
// router.post('/login', userController.login);

// Récupérer tous les Mofawadhiya
router.get('/', userController.getAllMofawadhiya);

// Récupérer un Mofawadhiya par ID
router.get('/:id', userController.getMofawadhiyaById);

// Mettre à jour un Mofawadhiya
router.put('/:id', userController.updateMofawadhiya);

// Supprimer un Mofawadhiya
router.delete('/:id', userController.deleteMofawadhiya);

module.exports = router;
