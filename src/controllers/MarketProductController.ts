export {}
const MarketProductService = require('../service/MarketProductService')
import {ICRUDController} from "../types";

interface IMarketProductController extends ICRUDController{
  searchByProductAndMarket(req:any, res:any):Promise<void>
}

class MarketProductController implements IMarketProductController{
  async create(req:{body:{market_id: number, good_id:number, price:number, price_unit:string, price_compare:number, compare_unit:string}}, res:any){
    try {
      const {status, response} = await MarketProductService.create(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getAll(req: null, res:any){
    try {
      const {status, response} = await MarketProductService.getAll()
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getOne(req:{params:{id:number}}, res:any){
    try {
      const {status, response} = await MarketProductService.getOne(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async update(req:{body:{market_product_id:number, market_id: number, good_id:number, price:number, price_unit:string, price_compare:number, compare_unit:string}}, res:any){
    try {
      const {status, response} = await MarketProductService.update(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async delete(req:{params:{id:number}}, res:any){
    try {
      const {status, response} = await MarketProductService.delete(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async searchByProductAndMarket(req:{body:{market_id: number, good_id:number}}, res:any){
    try {
      const {status, response} = await MarketProductService.searchByProductAndMarket(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

}

module.exports = new MarketProductController()