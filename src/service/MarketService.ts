export {}
const db = require("../db");
import {IStatusResponse, ICRUDService} from "../types";


interface IMarketService extends ICRUDService{
  getOneByName(name: string):Promise<IStatusResponse>
}
class MarketService implements IMarketService{
  // CRUD
  async create(name:string): Promise<IStatusResponse>{
    if (!name) return {status: 400, response: 'No name specified'}

    //checking if this store is already in our database
    let duplicate:boolean = false
    const all = (await this.getAll()).response
    for(const item of all){
      if (item.name === name) {
        duplicate = true
      }
    }
    if (duplicate) return {status: 404, response: 'This market is already in db'}

    //adding a new store
    const createNew = await db.query(`insert into markets (name) values ($1) returning * `, [name])
    return {status: 200, response: createNew.rows[0]}
  }

  async getAll(): Promise<IStatusResponse>{
    const all = await db.query(`select * from markets`)
    if (!all.rows) return {status: 404, response: "Table of markets is empty"}
    return {status: 200, response: all.rows}
  }

  async getOne(id:any): Promise<IStatusResponse>{
    const one = await db.query(`select * from markets where market_id = $1`, [id])
    if (!one.rows[0]) return {status: 404, response: 'There is no market with this id'}
    return {status: 200, response: one.rows[0]}
  }

  async update(body:any): Promise<IStatusResponse>{
    if (!body) return {status: 400, response: 'No market specified'}
    if (!body.id || !body.name)
      return {status: 400, response: 'Required input fields: id, name'}

    const updated = await db.query(`update markets set name = $1 where market_id = $2 returning *`, [body.name, body.id])
    if (!updated.rows[0]) return {status: 404, response: 'There is no market with this id'}
    return {status: 200, response: updated.rows[0]}
  }

  async delete(id:any): Promise<IStatusResponse>{
    const removed = await db.query('delete from markets where market_id = $1 returning *', [id])
    if (!removed) return {status: 404, response: 'There is no market with this id'}
    return {status: 200, response: removed.rows[0]}
  }

  // unique methods
  async getOneByName(name:any): Promise<IStatusResponse>{
    const query = await db.query('select * from markets where name = $1', [name])
    return {status: 200, response: query.rows[0]}
  }
}

module.exports = new MarketService()