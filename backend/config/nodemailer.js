import nodemailer from 'nodemailer'
import { config } from 'dotenv'

config()

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

async function sendemail(to, sub, msg) {
    try {
        const info = await transporter.sendMail({
            from: '23eg112e53@anurag.edu.in',
            to,
            subject: sub,
            html: msg
        })

        console.log('MAIL SENT:', info.response)

    } catch (err) {

        console.error('MAIL ERROR:', err)
        throw err

    }
}

export default sendemail