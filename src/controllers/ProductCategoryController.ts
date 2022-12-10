const ProductsCategoryService = require('../service/ProductCategoryService')
import {ICRUDController} from "../types";

interface IProductCategoryController extends ICRUDController{
  getProductCategories(req: any, res:any): Promise<void>
  getRelation(req: any, res:any): Promise<void>
}
class ProductCategoryController implements IProductCategoryController{
  // CRUD methods:

  async create(req:{body:{good_id:number, category_id:number}}, res:any){
    try {
      const {status, response} = await ProductsCategoryService.create(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getAll(req:null, res:any){
    try {
      const {status, response} = await ProductsCategoryService.getAll()
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async getOne(req:{params:{id:number}}, res:any){
    try {
      const {status, response} = await ProductsCategoryService.getOne(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async update(req:{body:{product_category_id:number, good_id:number, category_id:number}}, res:any){
    try {
      const {status, response} = await ProductsCategoryService.update(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  async delete(req:{params:{id:number}}, res:any){
    try {
      const {status, response} = await ProductsCategoryService.delete(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

  // Unique methods:

  async getProductCategories(req:{params:{id:number}}, res:any){
    try {
      const {status, response} = await ProductsCategoryService.getProductCategories(req.params.id)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }
  async getRelation(req:{body:{good_id:number, category_id:number}}, res:any){
    try {
      const {status, response} = await ProductsCategoryService.getProductCategories(req.body)
      res.status(status).json(response)
    } catch (e) {
      res.status(500).json(e)
    }
  }

}

module.exports = new ProductCategoryController()