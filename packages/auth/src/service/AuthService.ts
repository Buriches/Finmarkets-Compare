import {IStatusResponse} from "@finmarkets/db-core/src/types";

export {}
const db = require('../db');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const sendEmail = require('../mailer/mailer')

const generateAccessToken = (id:number|string, email:string) => {
  const payload = {
    id,
    email
  }
  return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class AuthService{
  async registration(username:string, email:string, password:string): Promise<IStatusResponse>{
    username = username.trim()
    email = email.trim()
    password = password.trim()

    if (await this.searchByUsername(username)) return {status: 400, response: 'User already registered'}
    if (await this.searchByEmail(email)) return {status: 400, response: 'Email already registered'}

    const hashPassword = bcrypt.hashSync(password, 7)

    const code = (Math.random() * 9999).toString().split(".")[0]

    await db.query('insert into unconfirmed_users (name, email, password, code) values ($1, $2, $3, $4)', [username, email, hashPassword, code])

    await sendEmail(email, code)

    return {status: 200, response: `Check your email (${email})`}
  }

  async confirmRegistration(username:string, email:string, code:string): Promise<IStatusResponse>{
    username = username.trim()
    email = email.trim()

    if (await this.searchByUsername(username)) return {status: 400, response: 'User already registered'}
    if (await this.searchByEmail(email)) return {status: 400, response: 'Email already registered'}

    const check = await db.query(
      'select * from unconfirmed_users ' +
      'where name = $1 ' +
      'and email = $2 ' +
      'and code = $3 ', [username, email, code]
    )

    if (!check.rows[0]) return {status: 400, response: 'Incorrect data'}

    await db.query(
      'delete from unconfirmed_users ' +
      'where email = $1', [email]
    )

    await db.query(
      'insert into users (name, email, password) values ($1, $2, $3)', [check.rows[0].name, check.rows[0].email, check.rows[0].password]
    )

    return {status: 200, response: 'Fine! Now you can login'}
  }

  async login(username:string, password:string): Promise<IStatusResponse>{
    username = username.trim()
    password = password.trim()

    const user = await this.searchByUsername(username)
    if (!user) return {status: 400, response: `User ${username} is not in db`}

    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) return {status: 400, response: 'Password is incorrect'}

    const token = generateAccessToken(user.user_id, user.email)
    return {status: 200, response: token}
  }

  async getUsers(): Promise<IStatusResponse>{
    const allUsers = await db.query(
      'select * from users'
    )
    return {status: 200, response: allUsers.rows}
  }



  private async searchByUsername(username:string){
    const candidate = await db.query(
      'select * from users ' +
      'where name = $1', [username]
    )
    return candidate.rows[0]
  }

  private async searchByEmail(email:string){
    const candidate = await db.query(
      'select * from users ' +
      'where email = $1', [email]
    )
    return candidate.rows[0]
  }

}

module.exports = new AuthService()