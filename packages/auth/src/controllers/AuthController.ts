export {}
const AuthService = require("../service/AuthService");
const {validationResult} = require("express-validator");
interface IAuthController{
  registration(req:any, res:any): Promise<void>,
  login(req:any, res:any): Promise<void>,
  getUsers(req:any, res:any): Promise<void>,
  confirmRegistration(req:any, res:any): Promise<void>,

}

class AuthController implements IAuthController{
  async registration(req:{body:{username:string, email:string, password:string}}, res:any){
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) return res.status(400).json({message: "Register error", errors})

      const {username, email, password} = req.body
      const {status, response} = await AuthService.registration(username, email, password)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }
  async login(req:{body:{username:string, password:string}}, res:any){
    try {
      const {username, password} = req.body
      const {status, response} = await AuthService.login(username, password)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }
  async getUsers(req:any, res:any){
    try {
      const {status, response} = await AuthService.getUsers()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }
  async confirmRegistration(req:{body:{username:string, email:string, code:string}}, res:any){
    try {
      const {username, email, code} = req.body
      const {status, response} = await AuthService.confirmRegistration(username, email, code)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }
}


module.exports = new AuthController()