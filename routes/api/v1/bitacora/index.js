const express = require('express');
const router = express.Router();
const Bitacora = require('../../../../libs/bitacora');
const BitacoraDao = require('../../../../dao/models/BitacoraDao');
const userDao = new BitacoraDao();
const user = new Bitacora(userDao);
user.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await user.getVersion();
    return res.status(200).json(versionData);
  } catch (ex) {
    // manejar el error que pueda tirar el controlador
    console.error('Error Bitacora', ex);
    return res.status(502).json({ 'error': 'Error Interno de Server' });
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const bitacora = await user.getBitacora();
    return res.status(200).json(bitacora);
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
    const registro = await user.getBitacoraById({ codigo: parseInt(codigo) });
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
});

router.post('/new', async (req, res) => {
  try {
    const { type = '',
      description = '',
      date = '',
      amount = '',
      category = '' } = req.body;
      if (!(/^(INC)|(EXP)$/.test(type))) {
        return res.status(400).json({
          error: 'Se espera valor de tipo en INC o EXP'
        });
      }

    if (/^\s*$/.test(description)) {
      return res.status(400).json({
        error: 'Se espera valor de descripcion'
      });
    }
    if (/^\s*$/.test(date)) {
      return res.status(400).json({
        error: 'Se espera valor de date'
      });
    }
    if (/^\s*$/.test(amount)) {
      return res.status(400).json({
        error: 'Se espera valor de cantidad'
      });
    }
    if (/^\s*$/.test(category)) {
        return res.status(400).json({
          error: 'Se espera valor de categoria'
        });
      }
    const newBitacora = await user.addBitacora({
      type,
      description,
      date,
      amount,
      category
    });
    return res.status(200).json(newBitacora);
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
      const { type, description, date, amount, category } = req.body;
      if (!(/^(INC)|(EXP)$/.test(type))) {
        return res.status(400).json({
          error: 'Se espera valor de tipo en INC o EXP'
        });
      }
      if (/^\s*$/.test(description)) {
        return res.status(400).json({
          error: 'Se espera valor de categoría'
        });
      }
      if (/^\s*$/.test(date)) {
        return res.status(400).json({
          error: 'Se espera valor de categoría'
        });
      }
      if (/^\s*$/.test(amount)) {
        return res.status(400).json({
          error: 'Se espera valor de categoría'
        });
      }
      if (/^\s*$/.test(category)) {
        return res.status(400).json({
          error: 'Se espera valor de categoría'
        });
      }
  
      const updateResult = await user.updateBitacora({ codigo: parseInt(codigo), type, description, date, amount, category });
  
      if (!updateResult) {
        return res.status(404).json({ error: 'Bitacora no encontrada.' });
      }
      return res.status(200).json({ updatedBitacora: updateResult });
  
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

    const deletedBitacora = await user.deleteBitacora({ codigo: parseInt(codigo) });

    if (!deletedBitacora) {
      return res.status(404).json({ error: 'Bitacora no encontrada.' });
    }
    return res.status(200).json({ deletedBitacora });

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;