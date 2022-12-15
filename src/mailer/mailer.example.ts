export {}
require('dotenv').config()
const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const CLIENT_ID = 'example.apps.googleusercontent.com'
const CLIENT_SECRET = 'example'
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = 'example'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

module.exports = async function sendEmail(to:string, code:string) {
  try {
    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'example@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
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

    const result = await transport.sendMail(mailOptions)

    return result
  } catch (e) {
    console.log(e)
    return e
  }
}