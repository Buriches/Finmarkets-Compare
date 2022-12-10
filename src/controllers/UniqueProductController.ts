const UniqueProductService = require('../service/UniqueProductService')
import {ICRUDController} from "../types";

interface IUniqueProductController extends ICRUDController{

}
class UniqueProductController implements IUniqueProductController{
  async create(req:{body:{name: string, for_adults:boolean, path:string, brand:string, img:string, categories: number[]}}, res:any){
    try {
      const {status, response} = await UniqueProductService.create(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getAll(req:null, res:any){
    try {
      const {status, response} = await UniqueProductService.getAll()
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getOne(req:{params:{id:number}}, res:any){
    try {
      const {status, response} = await UniqueProductService.getOne(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async update(req:{body:{good_id:number, name:string, for_adults:boolean, path:string, brand: string}}, res:any){
    try {
      const {status, response} = await UniqueProductService.update(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async delete(req:{params:{id:number}}, res:any){
    try {
      const {status, response} = await UniqueProductService.delete(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getOneByName(req:{params:{name:string}}, res:any){
    try {
      const {status, response} = await UniqueProductService.getOneByName(req.params.name)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

}

module.exports = new UniqueProductController()