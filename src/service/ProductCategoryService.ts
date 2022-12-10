const db = require("../db");
import {IStatusResponse, ICRUDService} from "../types";

interface IProductCategoryService extends ICRUDService{
  getProductCategories(good_id:number): Promise<IStatusResponse>
  getRelation(body:{good_id:number, category_id:number}): Promise<IStatusResponse>
}

class ProductCategoryService implements IProductCategoryService{
  // CRUD methods:

  async create(body:{good_id:number, category_id:number}): Promise<IStatusResponse>{
    if (!body.good_id || !body.category_id)
      return {status: 400, response: 'Required input fields: good_id, category_id'}

    //checking if this store is already in our database
    let duplicate = false
    const all = (await this.getAll()).response
    all.forEach((item:{good_id:number, category_id:number})=>{
      if (item.good_id === body.good_id && item.category_id === body.category_id) {
        duplicate = true
      }
    })
    if (duplicate) return {status: 404, response: 'This link has is already in db'}

    //adding a new store
    const newProduct = await db.query(`insert into products_category (good_id, category_id) values ($1, $2) returning * `, [body.good_id, body.category_id])
    return {status: 200, response: newProduct.rows[0]}
  }

  async getAll(): Promise<IStatusResponse>{
    const all = await db.query(`select * from products_category`)
    if (!all.rows) return {status: 404, response: "Table is empty"}
    return {status: 200, response: all.rows}
  }

  async getOne(id:number): Promise<IStatusResponse>{
    const one = await db.query(`select * from products_category where product_category_id = $1`, [id])
    if (!one.rows[0]) return {status: 404, response: 'There is no product-category with this id'}
    return {status: 200, response: one.rows[0]}
  }

  async update(body:{product_category_id:number, good_id:number, category_id:number}): Promise<IStatusResponse>{
    if (!body) return {status: 400, response: 'No product-category specified'}
    if (!body.product_category_id || !body.good_id || !body.category_id)
      return {status:400, response: 'Required input fields: product_category_id, good_id, category_id'}

    const updated = await db.query(`update products_category set good_id = $2, category_id = $3 where product_category_id = $1 returning *`, [body.product_category_id, body.good_id, body.category_id])
    if (!updated.rows[0]) return {status: 404, response: 'There is no product-category with this id'}
    return {status: 200, response: updated.rows[0]}
  }

  async delete(id:number): Promise<IStatusResponse>{
    const removed = await db.query('delete from products_category where product_category_id = $1 returning *', [id])
    if (!removed) return {status: 404, response: 'There is no product-category with this id'}
    return {status: 200, response: removed.rows[0]}
  }

  // Unique methods:

  async getProductCategories(good_id:number): Promise<IStatusResponse>{
    const arrOfCategories = await db.query(
      'select * from products_category inner join category on category.category_id = products_category.category_id where good_id = $1'
      , [good_id]
    )
    return {status: 200, response: arrOfCategories.rows}
  }

  async getRelation(body:{good_id:number, category_id:number}): Promise<IStatusResponse>{
    const query = await db.query(
      'select * from products_category inner join category on category.category_id = products_category.category_id where good_id = $1 and products_category.category_id = $2'
      , [body.good_id, body.category_id]
    )
    return query.rows[0]
  }
}

module.exports = new ProductCategoryService()