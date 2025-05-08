
const express = require('express');
const { body } = require('express-validator');
const menuController = require('../controllers/menuController');
const router = express.Router();


const validateMenu = [
  body('nombre_plato')
    .notEmpty().withMessage('El nombre del plato es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('Debe tener entre 3 y 100 caracteres'),
  body('descripcion')
    .optional() 
    .isLength({ max: 500 }).withMessage('La descripción no debe exceder 500 caracteres'),
  body('precio')
    .isFloat({ min: 1000 }).withMessage('El precio mínimo es $1,000 COP')
    .custom(value => value >= 1000).withMessage('El precio no puede ser negativo'),
  body('restaurante_id')
    .isInt({ min: 1 }).withMessage('ID de restaurante inválido')
];


router.post('/', validateMenu, menuController.agregarPlato);
router.delete('/:id', menuController.eliminarPlato);
router.get('/:restaurante_id', menuController.getByRestaurante);

module.exports = router;
