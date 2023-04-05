const nodemailer = require('nodemailer');

const SMTP_CONFIG = require('./config/smtp');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: SMTP_CONFIG.auth.user,
        pass: SMTP_CONFIG.auth.pass

    },
    tls: {
        rejectUnauthorized: false,
    }
});

module.exports = async function restaurant(name,tel,email,mens) {

    //variaveis do corpo de envio do email com variação de idiomas para o novo aluno

      const mailSentPT = await transporter.sendMail({
        from: '"YK technology"" <signatureprojectjp@gmail.com>',
        to: ['paurozhiyuan@gmail.com','rootsgrillhekinan@gmail.com'],
        subject: `Aviso sobre contato pelo website`,
        text: `Prezado cliente

        ${name} entrou em contato atrávez to web site.

        Nome:${name}
        Telefone:${tel}
        E-mail:${email}
        Menssagem:${mens}

        YK technology`,
    });
};
