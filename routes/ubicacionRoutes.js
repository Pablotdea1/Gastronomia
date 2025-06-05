const express = require('express');
const { body } = require('express-validator');
const ubicacionController = require('../controllers/ubicacionController');
const router = express.Router();

// Validaciones para ubicaciones
const validateUbicacion = [
  body('ciudad').notEmpty().withMessage('La ciudad es obligatoria'),
  body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
  body('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitud inválida'),
  body('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitud inválida')
];

router.get('/', ubicacionController.index);
router.get('/new', ubicacionController.new);
router.post('/', validateUbicacion, ubicacionController.create);
router.get('/:id', ubicacionController.show);
router.delete('/:id', ubicacionController.delete);
router.get('/cercanas', ubicacionController.getCercanos);

module.exports = router;