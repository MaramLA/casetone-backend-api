import nodemailer from 'nodemailer'
import { dev } from '../config'

// email setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: dev.app.smtpUserName,
    pass: dev.app.smtpPassword,
  },
})

type EmailDataType = {
  email: string
  subject: string
  html: string
}

// utilize transporter to send email
export const sendEmail = async (emailData: EmailDataType) => {
  try {
    const mailOptions = {
      from: dev.app.smtpUserName,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    }

    const info = await transporter.sendMail(mailOptions)
  } catch (error) {
    throw error
  }
}
