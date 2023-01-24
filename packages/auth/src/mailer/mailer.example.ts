export {}
require('dotenv').config()
const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL)
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

module.exports = async function sendEmail(to:string, code:string) {
  try {
    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'example@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    })

    const mailOptions = {
      from: 'Activation code. No reply! <example.gmail.com>',
      to: to,
      subject: 'Activation code',
      text: `Hello! Your activation code is ${code}`,
      html: `<strong>Hello! Your activation code is ${code}</strong>`
    }

    return await transport.sendMail(mailOptions)
  } catch (e) {
    console.log(e)
    return e
  }
}