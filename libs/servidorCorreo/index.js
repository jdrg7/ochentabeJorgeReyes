const nodemailer = require('nodemailer');

const correo = async () => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'jord_reyesg@unicah.edu',
            pass: 'jorgereyes77',
        },
    });

    transporter.verify().then(() => {
        console.log('se puede enviar correos');
    });
    return transporter;
};

module.exports = correo;