const Usuario = require('../models/usuario');
const { generateToken } = require('../config/jwt');
const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
  try {
    // ...login logic...
    req.flash('success', '¡Bienvenido!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', 'Error al iniciar sesión');
    res.redirect('/auth/login');
  }
};
exports.showLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Iniciar Sesión',
    errors: []
  });
};

exports.showRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Registro',
    errors: []
  });
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const usuario = await Usuario.findByEmail(email);

    if (!usuario || !(await Usuario.comparePassword(password, usuario.password_hash))) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión',
        errors: [{ msg: 'Credenciales incorrectas' }]
      });
    }

    // Actualizar última sesión
    await Usuario.updateLastLogin(usuario.id);

    // Generar token JWT
    const token = generateToken(usuario.id);

    // Establecer cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      title: 'Iniciar Sesión',
      errors: [{ msg: 'Error al iniciar sesión' }]
    });
  }
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/register', {
        title: 'Registro',
        errors: errors.array()
      });
    }

    const { nombre, email, password } = req.body;
    
    // Verificar si el email ya existe
    const existingUser = await Usuario.findByEmail(email);
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Registro',
        errors: [{ msg: 'El email ya está registrado' }]
      });
    }

    // Crear usuario
    await Usuario.create({ nombre, email, password });
    
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Register error:', error);
    res.render('auth/register', {
      title: 'Registro',
      errors: [{ msg: 'Error al registrar usuario' }]
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/auth/login');
};