const gettingProductsService = require('../service/GettingProductsService')

interface IGettingProductsController{
  get24(req: any, res:any): Promise<void>
  get24withCategory(req: any, res:any): Promise<void>
  getProductsByName(req: any, res:any): Promise<void>
  getMainCategories(req: any, res:any): Promise<void>
  getUnderCategories(req: any, res:any): Promise<void>
  getProductPrices(req: any, res:any): Promise<void>
  getSameProducts(req: any, res:any): Promise<void>
}

class GettingProductsController implements IGettingProductsController{

  async get24(req:{query: {from: number}}, res: any){
    try {
      const {status, response} = await gettingProductsService.get24(req.query.from)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async get24withCategory(req:{query:{from:number, category_id:number}}, res:any){
    try {
      const {status, response} = await gettingProductsService.get24withCategory(req.query.from, req.query.category_id)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async get1ByPath(req:{query:{path:string}}, res:any){
    try {
      const {status, response} = await gettingProductsService.get1ByPath(req.query.path)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async getProductsByName(req:{body:{name:string}}, res:any){
    try {
      const {status, response} = await gettingProductsService.getProductsByName(req.body.name)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async getMainCategories(req:null, res:any){
    try {
      const {status, response} = await gettingProductsService.getMainCategories()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async getUnderCategories(req:{ query: { path: string } }, res:any){
    try {
      const {status, response} = await gettingProductsService.getUnderCategories(req.query.path)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async getAllCategories(req:any, res:any){
    try {
      const {status, response} = await gettingProductsService.getAllCategories()
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async getProductPrices(req:{params:{good_id:number}}, res:any){
    try {
      const {status, response} = await gettingProductsService.getProductPrices(req.params.good_id)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async getSameProducts(req:{body:{categories:string[]}}, res:any){
    try {
      const {status, response} = await gettingProductsService.getSameProducts(req.body.categories)
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }

  async getMarkets(req: any, res:any){
    try {
      const {status, response} = await gettingProductsService.getMarkets();
      res.status(status).json(response)
    } catch (e) {
      console.log(e)
      res.status(500).json(e)
    }
  }
}

module.exports = new GettingProductsController()