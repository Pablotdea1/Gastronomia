const express = require('express');
const { body } = require('express-validator');
const restauranteController = require('../controllers/restauranteController');
const router = express.Router();

// Validaciones
const validateRestaurante = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('tipo_cocina_id')
    .notEmpty().withMessage('Debe seleccionar un tipo de cocina')
    .isInt().withMessage('Tipo de cocina inválido'),
  body('ubicacion_id')
    .notEmpty().withMessage('Debe seleccionar una ubicación')
    .isInt().withMessage('Ubicación inválida'),
  body('precio_promedio')
    .notEmpty().withMessage('El precio promedio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
];

// Rutas
router.get('/', restauranteController.index);
router.get('/new', restauranteController.new);
router.post('/', validateRestaurante, restauranteController.create);
router.get('/:id', restauranteController.show);
router.get('/:id/edit', restauranteController.edit);
router.put('/:id', validateRestaurante, restauranteController.update);
router.delete('/:id', restauranteController.delete);

module.exports = router;