const express = require('express');
const { body } = require('express-validator');
const tipoCocinaController = require('../controllers/tipoCocinaController');
const router = express.Router();

// Validaciones
const validateTipoCocina = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres')
];

// Rutas
router.get('/', tipoCocinaController.index);
router.get('/new', tipoCocinaController.new);
router.post('/', validateTipoCocina, tipoCocinaController.create);
router.delete('/:id', tipoCocinaController.delete);

module.exports = router;

