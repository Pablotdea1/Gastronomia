const express = require('express');
const { body } = require('express-validator');
const restauranteController = require('../controllers/restauranteController');
const router = express.Router();


const validateRestaurante = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('tipo_cocina_id').isInt().withMessage('ID de cocina inválido'),
  body('precio_promedio').isFloat().withMessage('El precio debe ser un número')
];


router.get('/', restauranteController.index);
router.post('/', validateRestaurante, restauranteController.create);
router.get('/:id', restauranteController.show);
router.put('/:id', validateRestaurante, restauranteController.update);
router.delete('/:id', restauranteController.delete);

module.exports = router;