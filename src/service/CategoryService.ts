const db = require("../db");
import {IStatusResponse, ICRUDService} from "../types";

interface ICategoryService extends ICRUDService{
  getOneByName(name: string): Promise<IStatusResponse>
}
class CategoryService implements ICategoryService{
  async create(body:{name:string, path:string}): Promise<IStatusResponse>{
    if (!body) return {status: 400, response: 'No category specified'}
    if (!body.name || !body.path)
      return {status: 400, response: 'Required input fields: name, path'}

    //checking if this store is already in our database
    let duplicate = false
    const all = (await this.getAll()).response
    all.forEach((item:{name: string})=>{
      if (item.name === body.name) {
        duplicate = true
      }
    })
    if (duplicate) return {status: 404, response: 'This category is already in db'}

    //adding a new category
    const createNew = await db.query(`insert into category (name, path) values ($1, $2) returning * `, [body.name, body.path])
    return {status: 200, response: createNew.rows[0]}
  }

  async getAll(): Promise<IStatusResponse>{
    const all = await db.query(`select * from category`)
    if (!all.rows) return {status: 404, response: "Table of categories is empty"}
    return {status: 200, response: all.rows}
  }

  async getOne(id:number): Promise<IStatusResponse>{
    const one = await db.query(`select * from category where category_id = $1`, [id])
    if (!one.rows[0]) return {status: 404, response: 'There is no category with this id'}
    return {status: 200, response: one.rows[0]}
  }

  async update(body:{name: string, category_id: number, path: string}): Promise<IStatusResponse>{
    if (!body) return {status: 400, response: 'No category specified'}
    if (!body.category_id || !body.name || !body.path)
      return {status: 400, response: 'Required input fields: category_id, name, path,'}

    const updated = await db.query(`update category set name = $2, path = $3 where category_id = $1 returning *`, [body.category_id, body.name, body.path])
    if (!updated.rows[0]) return {status: 404, response: 'There is no category with this id'}
    return {status: 200, response: updated.rows[0]}
  }

  async delete(id: number): Promise<IStatusResponse>{
    const removed = await db.query('delete from category where category_id = $1 returning *', [id])
    if (!removed) return {status: 404, response: 'There is no category with this id'}
    return {status: 200, response: removed.rows[0]}
  }

  async getOneByName(name: string): Promise<IStatusResponse>{
    const query = await db.query('select * from category where name = $1', [name])
    return {status: 200, response: query.rows[0]}
  }


}

module.exports = new CategoryService()