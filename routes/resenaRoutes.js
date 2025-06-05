const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const resenaController = require('../controllers/resenaController'); 

const validateResena = [
  body('calificacion')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser entre 1 y 5'),
  body('comentario')
    .optional()
    .isLength({ max: 500 })
    .withMessage('El comentario no debe exceder 500 caracteres')
];

router.post('/:restaurante_id', validateResena, resenaController.createResena);
router.get('/:restaurante_id', resenaController.getResenasRestaurante);

module.exports = router;

