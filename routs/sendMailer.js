const nodemailer = require('nodemailer');

const ejs = require('ejs');

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

module.exports = async function (path, email, name, lang, lang2, email2, gymname) {

    //variaveis do corpo de envio do email com variação de idiomas para o novo aluno
    switch (lang) {
        case 'Portugues':
            const mailSentPT = await transporter.sendMail({
                from: `"${gymname}" <signatureprojectjp@gmail.com>`,
                to: ['paurozhiyuan@gmail.com'], //'kedinhofavorito@gmail.com', 'kledison2009@hotmail.com', email2
                subject: 'Seja bem vindo!',
                text: `Olá ${name} tudo bem? Segue em anexo sua ficha de inscrição`,
                attachments: [
                    {
                        path: path
                    }
                ]
            });
            break;
        case 'Inglês':
            const mailSentEN = await transporter.sendMail({
                from: `"${gymname}" <signatureprojectjp@gmail.com>`,
                to: ['paurozhiyuan@gmail.com'], //'kedinhofavorito@gmail.com', 'kledison2009@hotmail.com', email2
                subject: 'be welcome!',
                text: `Hello ${name} all right? Attached is your registration form.`,
                attachments: [
                    {
                        path: path
                    }
                ]
            });
            break;
        case '日本語':
            const mailSentJP = await transporter.sendMail({
                from: `"${gymname}" <signatureprojectjp@gmail.com>`,
                to: ['paurozhiyuan@gmail.com'], //'kedinhofavorito@gmail.com', 'kledison2009@hotmail.com'mudar para email, email2
                subject: '歓迎します!',
                text: `${name} 様, 今回入会していただきありがとうございます。
                申請書をご確認ください。`,
                attachments: [
                    {
                        path: path
                    }
                ]
            });
            break;
        default:
            console.log("error...")
    }
    //---------------------------------------------------------------------------------->

    //variaveis do corpo de envio do email com variação de idiomas para o gerente
    switch (lang2) {
        case 'PT':
            const mailManegerPT = await transporter.sendMail({
                from: '"YK technology" <signatureprojectjp@gmail.com>',
                to: ['paurozhiyuan@gmail.com', email2], //'kedinhofavorito@gmail.com', 'kledison2009@hotmail.com'
                subject: 'Novo cadastro!',
                text: `Prezado cliente

                Segue em anexo a ficha de inscrição do novo aluno ${name}.

                Agradecemos pela parceria e pela preferência.

                YK technology`,
                attachments: [
                    {
                        path: path
                    }
                ]
            });
            break;
        case 'EN':
            const mailManegerEN = await transporter.sendMail({
                from: '"YK technology" <signatureprojectjp@gmail.com>',
                to: ['paurozhiyuan@gmail.com', email2], //'kedinhofavorito@gmail.com', 'kledison2009@hotmail.com'
                subject: 'New customer!',
                text: `Dear customer

                Attached is the registration form for the new member ${name}.

                We thank you for your partnership and preference.

                YK technology`,
                attachments: [
                    {
                        path: path
                    }
                ]
            });
            break;
        case '日本語':
            const mailManegerJP = await transporter.sendMail({
                from: '"kledisom" <signatureprojectjp@gmail.com>',
                to: ['paurozhiyuan@gmail.com', email2], //'kedinhofavorito@gmail.com', 'kledison2009@hotmail.com'
                subject: '入会者の連絡!',
                text: `${name}様

                今回入会されました、"nome do aluno"の入会申込書を送付します。

                今後ともYK technologyとの付き合いをどうぞよろしくお願いいたします。

                システム不具合やご意見などありましたら、サポートへご連絡いただきまようよろしくお願いいたします。`,
                attachments: [
                    {
                        path: path
                    }
                ]
            });
            break;
        default:
            console.log("error...not found")
    };
    //---------------------------------------------------------------------------------->


};
