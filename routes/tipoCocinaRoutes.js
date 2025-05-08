const express = require('express');
const { body } = require('express-validator');
const tipoCocinaController = require('../controllers/tipoCocinaController');
const router = express.Router(); 


const validateTipoCocina = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('Debe tener entre 3 y 50 caracteres')
];


router.get('/', tipoCocinaController.obtenerTiposCocina);
router.post('/', validateTipoCocina, tipoCocinaController.crearTipoCocina);
router.delete('/:id', tipoCocinaController.deleteTipoCocina); 

module.exports = router;

