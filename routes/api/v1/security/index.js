const express = require('express');
let router = express.Router();
const Usuario = require('../../../../libs/usuarios');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');
const userDao = new UsuarioDao();
const user = new Usuario(userDao);
const correo = require('../../../../libs/servidorCorreo/index');

user.init();

const { jwtSign } = require('../../../../libs/security');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await user.getUsuarioByEmail({ email });

        if (!user.comparePasswords(password, userData.password)) {
            console.error('security login: ', {
                error: `Credenciales para usuario ${userData._id} ${userData.email} incorrectas.`,
            });

            return res.status(403).json({ error: 'Credenciales no Válidas' });
        }
        const { password: passwordDb, created, updated, ...jwtUser } = userData;

        const jwtToken = await jwtSign({
            jwtUser,
            generated: new Date().getTime(),
        });

        return res.status(200).json({ token: jwtToken });
    } catch (ex) {
        console.error('security login: ', { ex });

        return res
            .status(500)
            .json({ error: 'No es posible procesar la solicitud.' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email = '', password = '' } = req.body;

        if (/^\s*$/.test(email)) {
            return res.status(400).json({
                error: 'Se espera valor de correo',
            });
        }

        if (/^\s*$/.test(password)) {
            return res.status(400).json({
                error: 'Se espera valor de contraseña correcta',
            });
        }
        const newUsuario = await user.addUsuarios({
            email,
            nombre: 'John Doe',
            avatar: '',
            password,
            estado: 'ACT',
        });
        return res.status(200).json(newUsuario);
    } catch (ex) {
        console.error('security signIn: ', ex);
        return res.status(502).json({ error: 'Error al procesar solicitud' });
    }
});

router.post('/recuperarPass', async (req, res) => {
    const { email } = req.body;

    if (/^\s*$/.test(email)) {
        return res.status(400).json({
            error: 'Se espera valor de email',
        });
    }
    const usuario = await user.getUsuarioByEmail({ email });

    var passwordnueva = Date.now().toString();

    try {
        const transporte = await correo();

        await user.updateUsuario({
            codigo: usuario._id,
            email: usuario.email,
            nombre: usuario.nombre,
            avatar: usuario.avatar,
            password: passwordnueva,
            estado: usuario.estado,
        });

        await transporte.sendMail({
            from: 'jord_reyesg@unicah.edu',
            to: usuario.email,
            subject: 'Nuevas Password',
            text: 'Nueva password',
            html: `Tu nueva contraseña ${passwordnueva} se envió`,
        });

        res.json({
            msg: `Se envio a tu correo`,
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
