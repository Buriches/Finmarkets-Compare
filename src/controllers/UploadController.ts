import {ErrorRequestHandler, NextFunction} from "express";

export {}
const UploadService = require('../service/UploadService')

interface IUploadController {
  updatePrisma(req:any, res:any): Promise<void>,
  updateSmarket(req:any, res:any): Promise<void>,
  updateHerkku(req:any, res:any): Promise<void>,
  updateAlepa(req:any, res:any): Promise<void>,
  updateSale(req:any, res:any): Promise<void>,
  updateSokosHerkku(req:any, res:any): Promise<void>,
  updateMestarinHerkku(req:any, res:any): Promise<void>
}
class UploadController implements IUploadController{

  async updatePrisma(req:any, res:any){
    try {
      const {status, response} = await UploadService.updatePrisma()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async updateSmarket(req:any, res:any){
    try {
      const {status, response} = await UploadService.updateSmarket()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async updateHerkku(req:any, res:any){
    try {
      const {status, response} = await UploadService.updateHerkku()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async updateAlepa(req:any, res:any){
    try {
      const {status, response} = await UploadService.updateAlepa()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async updateSale(req:any, res:any){
    try {
      const {status, response} = await UploadService.updateSale()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async updateSokosHerkku(req:any, res:any){
    try {
      const {status, response} = await UploadService.updateSokosHerkku()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async updateMestarinHerkku(req:any, res:any){
    try {
      const {status, response} = await UploadService.updateMestarinHerkku()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

}

module.exports = new UploadController()