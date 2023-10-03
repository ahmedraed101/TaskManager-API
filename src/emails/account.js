const formData = require('form-data')
const Mailgun = require('mailgun.js')
const mailgun = new Mailgun(formData)

const API_KEY = process.env.EMAIL_SEND_KEY
const DOMAIN = process.env.EMIAL_DOMAIN

const mg = mailgun.client({
    username: 'api',
    key: API_KEY,
})

const sendWellcomeEmail = (email, name) => {
    mg.messages.create(DOMAIN, {
        from: 'az3556799@gmail.com',
        to: email,
        subject: 'Thanks for joining In!',
        text: `Wellcome to the App ${name}, this me Ahmed Raed`,
        // html: '<h1>Wellcome</h1>',
    })
}

const sendCancelationEmail = (name, email) => {
    mg.messages.create(DOMAIN, {
        from: 'az3556799@gmail.com',
        to: email,
        subject: 'Cancelation message',
        text: `GoodBy ${name}, Is There something we could have done to keep you with us`,
    })
}

module.exports = { sendWellcomeEmail, sendCancelationEmail }
