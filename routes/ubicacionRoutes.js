const express = require('express');
const { body } = require('express-validator');
const ubicacionController = require('../controllers/ubicacionController');
const router = express.Router();

// Validaciones para ubicaciones
const validateUbicacion = [
  body('lat')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
  body('lng')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida')
];


router.get('/cercanas', ubicacionController.getCercanos);
router.post('/', validateUbicacion, ubicacionController.crearUbicacion);

module.exports = router;