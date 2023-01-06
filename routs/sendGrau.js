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

module.exports = async function mailerGrau(name) {

    //variaveis do corpo de envio do email com variação de idiomas para o novo aluno

      const mailSentPT = await transporter.sendMail({
        from: '"YK technology"" <signatureprojectjp@gmail.com>',
        to: ['paurozhiyuan@gmail.com','leandrokussano@gmail.com'],
        subject: `Aviso sobra a graduação do aluno ${name}`,
        text: `Prezado cliente

        O aluno ${name} participou da aula número 39!.

        Verifique pelo sistema os detalhes.

        Agradecemos pela parceria e pela preferência.

        YK technology`,

    });


};







