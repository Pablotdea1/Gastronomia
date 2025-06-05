const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { isGuest } = require('../middleware/auth');
const router = express.Router();

// Validaciones
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Ingrese un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

const validateRegister = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener al menos 3 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Ingrese un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    })
];

// Rutas de autenticación
router.get('/login', isGuest, authController.showLogin);
router.post('/login', validateLogin, authController.login);
router.get('/register', isGuest, authController.showRegister);
router.post('/register', validateRegister, authController.register);
router.get('/logout', authController.logout);

module.exports = router;