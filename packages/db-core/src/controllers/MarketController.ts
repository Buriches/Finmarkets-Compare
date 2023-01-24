const MarketService = require('../service/MarketService')
import { ICRUDController } from "../types";

interface IMarketController extends ICRUDController{

}

class MarketController implements IMarketController{
  async create(req:{body:{name:string}}, res:any){
    try {
      const {status, response} = await MarketService.create(req.body.name)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getAll(req:null, res:any){
    try {
      const {status, response} = await MarketService.getAll()
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getOne(req:{params:{id:number}}, res:any){
    try {
      const {status, response} = await MarketService.getOne(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async update(req:{body:{id:number, name:string}}, res:any){
    try {
      const {status, response} = await MarketService.update(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async delete(req:{params:{id:number}}, res:any){
    try {
      const {status, response} = await MarketService.delete(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getOneByName(req:{params:{name:string}}, res:any){
    try {
      const {status, response} = await MarketService.getOneByName(req.params.name)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
}

module.exports = new MarketController()