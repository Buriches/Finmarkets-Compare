const db = require("../db");
import {IStatusResponse, ICRUDService} from "../types";

interface IUniqueProductService extends ICRUDService{
  getOneByName(name: string):Promise<IStatusResponse>
}

class UniqueProductService implements IUniqueProductService{
  async create(body:{name: string, for_adults:boolean, path:string, brand:string, img:string, categories: number[]}): Promise<IStatusResponse>{
    if (!body.hasOwnProperty('name') || !body.hasOwnProperty('for_adults') || !body.hasOwnProperty('path') || !body.hasOwnProperty('brand') || !body.hasOwnProperty('img') || !body.hasOwnProperty('categories'))
      return {status: 400, response: 'Required input fields: name, for_adults, path, brand, img, categories'}

    //checking if this product is already in our database
    let duplicate = false
    const all = (await this.getAll()).response
    for(const item of all){
      if (item.name === body.name && item.path === body.path) {
        duplicate = true
      }
    }
    if (duplicate) return {status: 404, response: 'This product is already in db'}

    //adding a new product
    const createNew = await db.query(`insert into unique_products (name, for_adults, path, brand, img, categories) values ($1, $2, $3, $4, $5, $6) returning * `, [body.name, body.for_adults, body.path, body.brand, body.img, body.categories])
    return {status: 200, response: createNew.rows[0]}
  }

  async getAll(): Promise<IStatusResponse>{
    const all = await db.query(`select * from unique_products`)
    if (!all.rows) return {status: 404, response: "Table of products is empty"}
    return {status: 200, response: all.rows}
  }

  async getOne(id:number): Promise<IStatusResponse>{
    const one = await db.query(`select * from unique_products where good_id = $1`, [id])
    if (!one.rows[0]) return {status: 404, response: 'There is no product with this id'}
    return {status: 200, response: one.rows[0]}
  }

  async update(body:{good_id:number, name:string, for_adults:boolean, path:string, brand: string}): Promise<IStatusResponse>{
    if (!body) return {status: 400, response: 'No product specified'}
    if (!body.good_id || !body.name || !body.for_adults || !body.path || !body.brand)
      return {status: 400, response: 'Required input fields: good_id, name, for_adults, path, brand. for_adults will be in in quotation marks'}

    const updated = await db.query(`update unique_products set name = $2, for_adults = $3, path = $4, brand = $5 where good_id = $1 returning *`, [body.good_id, body.name, body.for_adults, body.path, body.brand])
    if (!updated.rows[0]) return {status: 404, response: 'There is no product with this id'}
    return {status: 200, response: updated.rows[0]}
  }

  async delete(id:number): Promise<IStatusResponse>{
    const removed = await db.query('delete from unique_products where good_id = $1 returning *', [id])
    if (!removed) return {status: 404, response: 'There is no product with this id'}
    return {status: 200, response: removed.rows[0]}
  }

  async getOneByName(name:string): Promise<IStatusResponse>{
    const query = await db.query('select * from unique_products where name = $1', [name])
    return {status: 200, response: query.rows[0]}
  }

  async getOneByNameAndPath(name:string, path:string): Promise<IStatusResponse>{
    const query = await db.query('select * from unique_products where name = $1 and path = $2', [name, path])
    return {status: 200, response: query.rows[0]}
  }
}

module.exports = new UniqueProductService()