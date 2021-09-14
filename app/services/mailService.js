const SPOT_SESSION_EXPIRE_TIME_MIN = require("./../../config/constants.js")['SPOT_SESSION_EXPIRE_TIME_MIN'];
const DELIVERY_AND_PICKUP_SESSION_EXPIRE_TIME_MIN = require("./../../config/constants.js")['DELIVERY_AND_PICKUP_SESSION_EXPIRE_TIME_MIN'];

const nodemailer = require("nodemailer");
const Email = require('email-templates');

module.exports = (function () {
    return {
        sendMail,
        sendMailTemplate
    };

    function sendMailTemplate(mailTemplateName, to, dataObj) {
        let transporter = nodemailer.createTransport({
            host: "mail.tabl.bg",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "notify@tabl.bg",
                pass: "4FQga#kz,u,W",
            },
            tls: {
                rejectUnauthorized: false
            }
        });


        const email = new Email({
            message: {
                from: '"TabL.BG" <notify@tabl.bg>',
                to: to // 'nikibudinov@gmail.com'
            },
            // uncomment below to send emails in development/test env:
            send: true,
            transport: transporter
        });

        email
        .send({
          template:  './../app/mail_templates/'+mailTemplateName,
        //   message: {
        //     to: 'nikibudinov@gmail.com'
        //   },
          locals: dataObj
        })
        .then(res => {
        //   console.log('res.originalMessage', res.originalMessage)
        })
        .catch(console.error);
    }

    async function sendMail(from, to, subject, body) {

        let transporter = nodemailer.createTransport({
            host: "mail.tabl.bg",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "notify@tabl.bg",
                pass: "4FQga#kz,u,W",
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"TabL.BG" <notify@tabl.bg>', // sender address
            to: to, // list of receivers   "bar@example.com, baz@example.com"
            subject: subject, // Subject line
            // text: "Hello world?", // plain text body
            html: body, // html body
        });

        //   console.log("Message sent: %s", info.messageId);

        return info;
    }
});