const express = require('express');
const router = express.Router();

const usuariosRoutes = require('./usuarios');

router.use('/users', usuariosRoutes);

module.exports = router;