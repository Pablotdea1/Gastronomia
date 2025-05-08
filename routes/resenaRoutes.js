const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController'); 

router.post('/:restaurante_id', resenaController.createResena);
router.get('/:restaurante_id', resenaController.getResenasRestaurante);

module.exports = router;

