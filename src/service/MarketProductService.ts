const db = require("../db");
import {ICRUDService, IStatusResponse} from "../types";

interface IMarketProductService extends ICRUDService{

}
class MarketProductService implements IMarketProductService{
  // CRUD methods

  async create(body:{market_id: number, good_id:number, price:number, price_unit:string, price_compare:number, compare_unit:string}): Promise<IStatusResponse>{
    if (!body.market_id || !body.good_id || !body.price || !body.price_unit || !body.price_compare || !body.compare_unit)
      return {status: 400, response: 'Required input fields: market_id, good_id, price, price_unit, price_compare, compare_unit'}

    //checking if this product-service is already in our database
    let duplicate = false
    const all = (await this.getAll()).response
    all.forEach((item:{market_id:number, good_id:number})=>{
      if (item.market_id === body.market_id && item.good_id === body.good_id) {
        duplicate = true
      }
    })
    if (duplicate) return  {status: 404, response: 'This product-service is already in db'}

    //adding a new product-service
    const createNew = await db.query(`insert into market_product (market_id, good_id, price, price_unit, price_compare, compare_unit) values ($1, $2, $3, $4, $5, $6) returning * `, [body.market_id, body.good_id, body.price, body.price_unit, body.price_compare, body.compare_unit])
    //console.log("good: "body.good_id)
    return {status: 200, response: createNew.rows[0]}
  }

  async getAll(): Promise<IStatusResponse>{
    const all = await db.query(`select * from market_product`)
    if (!all.rows) return {status: 404, response: "Table of product-service is empty"}
    return {status: 200, response: all.rows}
  }

  async getOne(id:number): Promise<IStatusResponse>{
    const one = await db.query(`select * from market_product where market_product_id = $1`, [id])
    if (!one.rows[0]) return {status: 404, response: 'There is no product-service with this id'}
    return {status: 200, response: one.rows[0]}
  }

  async update(body:{market_product_id:number, market_id: number, good_id:number, price:number, price_unit:string, price_compare:number, compare_unit:string}): Promise<IStatusResponse>{
    if (!body) return {status: 400, response: 'No product-service specified'}
    if (!body.market_product_id || !body.market_id || !body.good_id || !body.price || !body.price_unit || !body.price_compare || !body.compare_unit)
      return {status: 400, response: 'Required input fields: good_id, name, for_adults, path, brand. for_adults will be in in quotation marks'}

    const updated = await db.query(`update market_product set market_id = $2, good_id = $3, price = $4, price_unit = $5, price_compare = $6, compare_unit = $7 where market_product_id = $1 returning *`, [body.market_product_id, body.market_id, body.good_id, body.price, body.price_unit, body.price_compare, body.compare_unit])
    if (!updated.rows[0]) return {status: 404, response: 'There is no product-service with this id'}
    return {status: 200, response: updated.rows[0]}
  }

  async delete(id:number): Promise<IStatusResponse>{
    const removed = await db.query('delete from market_product where market_product_id = $1 returning *', [id])
    if (!removed) return {status: 404, response: 'There is no product-service with this id'}
    return {status: 200, response: removed.rows[0]}
  }

  //
  async searchByProductAndMarket(body:{market_id: number, good_id:number}): Promise<IStatusResponse>{
    const res = await db.query(`select * from market_product where market_id = $1 and good_id = $2`, [body.market_id, body.good_id])
    return res.rows[0]
  }
}

module.exports = new MarketProductService()