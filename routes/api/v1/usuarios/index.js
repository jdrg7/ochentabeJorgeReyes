const express = require('express');
const router = express.Router();
const Usuario = require('../../../../libs/usuarios');
const UsuarioDao = require('../../../../dao/models/UsuarioDao');
const userDao = new UsuarioDao();
const user = new Usuario(userDao);
user.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await user.getVersion();
    return res.status(200).json(versionData);
  } catch (ex) {
    // manejar el error que pueda tirar el controlador
    console.error('Error Usuario', ex);
    return res.status(502).json({ 'error': 'Error Interno de Server' });
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const usuario = await user.getUsuarios();
    return res.status(200).json(usuario);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
});

router.get('/byid/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({
        error: 'Se espera un codigo numérico'
      });
    }
    const registro = await user.getUsuarioById({ codigo: parseInt(codigo) });
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
});

router.post('/new', async (req, res) => {
  try {
    const { email = '',
      password = '',
      nombre = '',
      avatar = '',
      estado = '',
      fchIngreso = '' } = req.body;
      if (/^\s*$/.test(email)) {
        return res.status(400).json({
          error: 'Se espera valor de email'
        });
      }

    if (/^\s*$/.test(password)) {
      return res.status(400).json({
        error: 'Se espera valor de password'
      });
    }
    if (/^\s*$/.test(nombre)) {
      return res.status(400).json({
        error: 'Se espera valor de nombre'
      });
    }
    if (/^\s*$/.test(avatar)) {
      return res.status(400).json({
        error: 'Se espera valor de avatar'
      });
    }
    if (!(/^(ACT)|(INA)$/.test(estado))) {
      return res.status(400).json({
        error: 'Se espera valor de tipo ACT o INA en estado'
      });
    }
    if (/^\s*$/.test(fchIngreso)) {
      return res.status(400).json({
        error: 'Se espera valor de cantidad'
      });
    }
    const newUsuario = await user.addUsuarios({
      email,
      password,
      nombre,
      avatar,
      estado,
      fchIngreso
    });
    return res.status(200).json(newUsuario);
  } catch (ex) {
    console.error(ex);
    return res.status(502).json({ error: 'Error al procesar solicitud' });
  }
});

router.put('/update/:codigo', async (req, res) => {
    try {
      const { codigo } = req.params;
      if (!(/^\d+$/.test(codigo))) {
        return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
      }
      const { email, password, nombre, avatar, estado } = req.body;
      if (/^\s*$/.test(email)) {
        return res.status(400).json({
          error: 'Se espera valor de email'
        });
      }
      if (/^\s*$/.test(password)) {
        return res.status(400).json({
          error: 'Se espera valor de password'
        });
      }
      if (/^\s*$/.test(nombre)) {
        return res.status(400).json({
          error: 'Se espera valor de nombre'
        });
      }
      if (/^\s*$/.test(avatar)) {
        return res.status(400).json({
          error: 'Se espera valor de avatar'
        });
      }
      if (!(/^(ACT)|(INA)$/.test(estado))) {
        return res.status(400).json({
          error: 'Se espera valor de tipo ACT o INA en estado'
        });
      }
  
      const updateResult = await user.updateUsuario({ codigo: parseInt(codigo), email, password, nombre, avatar, estado });
  
      if (!updateResult) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      return res.status(200).json({ updatedUsuario: updateResult });
  
    } catch (ex) {
      console.error(ex);
      res.status(500).json({ error: 'Error al procesar solicitud.' });
    }
  });


router.delete('/delete/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }

    const deletedUsuario = await user.deleteUsuario({ codigo: parseInt(codigo) });

    if (!deletedUsuario) {
      return res.status(404).json({ error: 'Usuario no encontrada.' });
    }
    return res.status(200).json({ deletedUsuario });

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;