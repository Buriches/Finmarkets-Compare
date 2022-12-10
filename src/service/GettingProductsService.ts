const db = require("../db");
const CategoryService = require('./CategoryService')
import {IStatusResponse} from "../types";

interface IGettingProductsService{
  get24(req: any, res:any): Promise<IStatusResponse>
  get24withCategory(req: any, res:any): Promise<IStatusResponse>
  getProductsByName(req: any, res:any): Promise<IStatusResponse>
  getMainCategories(req: any, res:any): Promise<IStatusResponse>
  getUnderCategories(req: any, res:any): Promise<IStatusResponse>
  getProductPrices(req: any, res:any): Promise<IStatusResponse>
  getSameProducts(req: any, res:any): Promise<IStatusResponse>
}

class GettingProductsService implements IGettingProductsService{

  async get24(from:number): Promise<IStatusResponse>{

    const query = await db.query(
      'select * from unique_products ' +
      'limit 24 ' +
      'offset $1 ', [from]
    )

    return {status: 200, response: await this.addFullCategories(await this.addPrices(query))}
  }

  async get24withCategory(from:number, category:string): Promise<IStatusResponse>{

    const query = await db.query(
      'select * from unique_products ' +
      'where categories[1] = $2 ' +
      'or categories[2] = $2 ' +
      'or categories[3] = $2 '+
      'limit 24 ' +
      'offset $1', [from, category]
    )

    return {status: 200, response: await this.addFullCategories(await this.addPrices(query))}
  }

  async getProductsByName(name:string): Promise<IStatusResponse>{
    const query = await db.query(
      'select * from unique_products ' +
      'where LOWER(unique_products.name) like LOWER($1);', [`%${name}%`]
    )

    return {status: 200, response: await this.addFullCategories(await this.addPrices(query))}
  }

  async getMainCategories(): Promise<IStatusResponse>{
    const query = await db.query('select * from category where path not like \'%/%\';')


    return {status: 200, response: query.rows}
  }

  async getUnderCategories(path:string): Promise<IStatusResponse>{
    const query = await db.query(
      'select * from category ' +
      'where path like $1 ' +
      'and path not like $2 ;', [`${path}/%`, `${path}/%/%`]
    )

    return {status: 200, response: query.rows}
  }

  async getProductPrices(good_id:number): Promise<IStatusResponse>{
    const query = await db.query(
      'select * from market_product ' +
      'where good_id = $1;', [good_id]
    )

    return {status: 200, response: query.rows}
  }

  async getSameProducts(categories:string[]): Promise<IStatusResponse>{
    const bodyOfQuery = () => {
      if (categories.length === 0) return {status: 200, response: "There is no categories"}
      let text = "select * from unique_products where "
      for (let i = 0; i < categories.length; i++){
        text += `categories[${i+1}] = $${i+1}`
        if (i+1 !== categories.length) text += " and "
      }
      text += ";"
      return text
    }

    const query = await db.query(
      bodyOfQuery(), categories
    )

    return {status: 200, response: query}
  }

  private addPrices = async (query:any) => {
    let arr:{rows: number[]} = {rows: []}
    for (let i = 0; i < query.rows.length; i++){
      const arrOfPrices = async () => {
        return {...query.rows[i], prices: (await new GettingProductsService().getProductPrices(query.rows[i].good_id)).response}
      }
      arr.rows.push(await arrOfPrices())
    }
    return arr
  }

  private addFullCategories = async (query:any) => {
    let arrOutput = []
    for (let i = 0; i < query.rows?.length; i++){
      const getArrCategories = async () =>{
        let arrCategories:string[] = []
        for(let j = 0; j < query.rows[i].categories?.length; j++){
          arrCategories = [...arrCategories, (await CategoryService.getOne(query.rows[i].categories[j])).response]
        }
        return arrCategories
      }
      const output = {...query.rows[i], categories: await getArrCategories()}
      arrOutput.push(output)
    }
    return arrOutput
  }

}

module.exports = new GettingProductsService()