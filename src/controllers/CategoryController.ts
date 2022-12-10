export {}
const CategoryService = require('../service/CategoryService')
import {ICRUDController} from "../types";

interface ICategoryController extends ICRUDController{
  getOneByName(req: any, res: any): Promise<void>
}

class CategoryController implements ICategoryController{
  async create(req:{body:{name:string, path: string}}, res:any){
    try {
      const {status, response} = await CategoryService.create(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async getAll(req:null, res:any){
    try {
      const {status, response} = await CategoryService.getAll()
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async getOne(req:any, res:any){
    try {
      const {status, response} = await CategoryService.getOne(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async update(req:any, res:any){
    try {
      const {status, response} = await CategoryService.update(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async delete(req:any, res:any){
    try {
      const {status, response} = await CategoryService.delete(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async getOneByName(req: {params: {name: string}}, res:any){
    try {
      const {status, response} = await CategoryService.getOneByName(req.params.name)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
}

module.exports = new CategoryController()