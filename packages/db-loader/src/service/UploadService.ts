const axios = require('axios')
import {IStatusResponse} from "@finmarkets/db-core/src/types";
import { decodeMarket } from "@finmarkets/utils";

const UniqueProductService = require('@finmarkets/db-core/src/service/UniqueProductService')
const CategoryService = require('@finmarkets/db-core/src/service/CategoryService')
const MarketProductService = require('@finmarkets/db-core/src/service/MarketProductService')
const MarketService = require('@finmarkets/db-core/src/service/MarketService')

class UploadService{

  localCategories:{category_id:number, name:string, path:string}[] = []
  localUniqueProducts:{
    good_id: number,
    name: string,
    for_adults: boolean,
    path: string,
    brand: string,
    img: string,
    categories: number[]}[] = []

  async updatePrisma(): Promise<IStatusResponse>{
    try {
      const market = decodeMarket('prisma')
      await this.updateLogic(market)
      return {status: 200, response: "prisma finished"}
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
  }

  async updateSmarket(): Promise<IStatusResponse>{
    try {
      const market = decodeMarket('s-market')
        await this.updateLogic(market)
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "s-market finished"}
  }

  async updateHerkku(): Promise<IStatusResponse>{
    try {
      await this.updateLogic(decodeMarket('herkku'))
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "herukku finished"}
  }

  async updateAlepa(): Promise<IStatusResponse>{
    try {
      await this.updateLogic(decodeMarket('alepa'))
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "alepa finished"}
  }

  async updateSale(): Promise<IStatusResponse>{
    try {
      const market = decodeMarket('sale')
      await this.updateLogic(market)
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "sale finished"}
  }

  async updateSokosHerkku(): Promise<IStatusResponse>{
    try {
      await this.updateLogic(decodeMarket('sokos-herkku'))
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "sokos-herkku finished"}
  }

  async updateMestarinHerkku(): Promise<IStatusResponse>{
    try {
      await this.updateLogic(decodeMarket('mestarin-herkku'))
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "mestarin-herkku finished"}
  }


  private async updateLogic(market:string|number){
    // work with market table
    const market_id = await this.updateMarket(market)
    let i = 0
    const step = 2500
    let arr:any[] = []
    let total = 0
    while(true){
      i += step
      const res = await this.uploadQuery(step, i - step, market)
      total += res.data.data.store.products.items.length
      console.log(res.data.data.store.products.items.length + " total: " + total)
      if (res.data.data.store.products.items.length === 0) {
        break
      }
      arr.push(...res.data.data.store.products.items)
    }
    await this.addToBd(arr, market_id)
  }

  private async addToBd(arr:any[], market_id:number){
    try {
      console.log(arr.length)

      await this.insertAllCategories(arr)

      await this.insertAllUniqueProducts(arr)

      await this.insertAllMarketProduct(arr, market_id)

      return
    } catch (e) {
      console.log(e)
    } finally {
      console.log('finished!')
    }
  }

  private async insertAllCategories(arr:any[]){
    try {
      console.log('starts insert categories')
      for (const item of arr){
        if (!item.hierarchyPath) continue
        for (const category of item.hierarchyPath)
          await this.updateCategory(category.name, category.slug)
      }
    } catch (e) {
      console.log(e)
    }
  }
  private async insertAllUniqueProducts(arr:any[]) {
    console.log('starts insert unique')
    for (const item of arr){
      const getArrCategories = async () => {
        let categories:any[] = []
        if(item.hierarchyPath !== null && item.hierarchyPath !== undefined){
          for (let i = 0; i < item.hierarchyPath.length; i++){
            if (item.hierarchyPath[i].name)
            categories.push(this.localCategories.find(local => local.name === item.hierarchyPath[i].name && local.path === item.hierarchyPath[i].slug)?.category_id)
          }
        }else{
          return []
        }

        return categories
      }

      const product = {
        name: item.name,
        for_adults: item.isAgeLimitedByAlcohol,
        path: item.slug,
        brand: item.brandName,
        img: item.ean,
        categories: await getArrCategories()
      }

      await this.updateUniqueProducts(product)
    }
  }

  private async insertAllMarketProduct(arr:any[], market_id:number){
    console.log('starts insert market-products')
    for (const item of arr){
      const good_id = this.localUniqueProducts.find(local => local.name === item.name && local.path === item.slug)?.good_id
      const body:{market_id: number, good_id: number | undefined, price: number, price_unit: string, price_compare: number, compare_unit: string} = {
        market_id: market_id,
        good_id: good_id,
        price: parseFloat(item.price.toFixed(2)),
        price_unit: item.priceUnit,
        price_compare: item.comparisonPrice,
        compare_unit: item.comparisonUnit
      }
      await this.updateMarketProduct(body)
    }
  }

  private async updateMarket(market:string|number){

    const query = await MarketService.getOneByName(decodeMarket(market))
    if (query?.response.market_id) return query.response.market_id
    return 999

  }

  private async updateUniqueProducts(product: {name: string, for_adults: boolean, path: string, brand: string, img: string, categories: any[]}){
    if (this.localUniqueProducts.find(item => item.name === product.name && item.path === product.path)) {
      return this.localUniqueProducts.find(item => item.name === product.name && item.path === product.path)?.good_id
    }
    const query = await UniqueProductService.getOneByNameAndPath(product.name, product.path)
    if (query.response?.good_id) {
      this.localUniqueProducts.push(query.response)
      return this.localUniqueProducts.find(item => item.name === product.name && item.path === product.path)?.good_id
    }

    //create new unique product
    const createUniqueProduct = (await UniqueProductService.create(product)).response
    this.localUniqueProducts.push(createUniqueProduct)
    return this.localUniqueProducts.find(item => item.name === product.name && item.path === product.path)?.good_id
  }

  private async updateCategory(name:string, path:string){
    if (this.localCategories.find(item => item.name === name && item.path === path)){
      return this.localCategories.find(item => item.name === name && item.path === path)?.category_id
    }
    const query = await CategoryService.getOneByNameAndPath(name, path)

    if (query.response?.category_id) {
      this.localCategories.push(query.response)
      return this.localCategories.find(item => item.name === name && item.path === path)?.category_id
    }
    const body = {
      name: name,
      path: path
    }
    //create new category

    const createCategory = (await CategoryService.create(body)).response

    this.localCategories.push(createCategory)
    return this.localCategories.find(item => item.name === name && item.path === path)?.category_id
  }

  private async updateMarketProduct(body:{market_id: number, good_id: number | undefined, price: number, price_unit: string, price_compare: number, compare_unit: string}){

    const query = await MarketProductService.searchByProductAndMarket(body)
    if (query?.market_product_id) return

    return (await MarketProductService.create(body)).response
  }

  async uploadQuery(limit:number, from:number, market:string|number){
    return await axios.get(this.queryForDownloadDataBase(limit, from, market), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  queryForDownloadDataBase(limit:number, from:number, market:string|number){
    return `https://cfapi.voikukka.fi/graphql?operationName=RemoteFilteredProducts&variables=%7B%22includeAvailabilities%22%3Afalse%2C%22availabilityDate%22%3A%22${this.nowDate()}%22%2C%22facets%22%3A%5B%7B%22key%22%3A%22brandName%22%2C%22order%22%3A%22asc%22%7D%2C%7B%22key%22%3A%22labels%22%7D%5D%2C%22generatedSessionId%22%3A%2218c1e719-19ad-44d4-b3d0-c3d0279466c3%22%2C%22includeAgeLimitedByAlcohol%22%3Atrue%2C%22limit%22%3A${limit}%2C%22queryString%22%3A%22%22%2C%22searchProvider%22%3A%22loop54%22%2C%22slug%22%3A%22%22%2C%22storeId%22%3A%22${market}%22%2C%22useRandomId%22%3Afalse%2C%22from%22%3A${from}%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2282d59a54ea6c6e151f843b9d091d0e94ba79665fbefa0a6280bbc797cacfb63c%22%7D%7D`
  }

  nowDate(){
    const date = new Date()
    return `${date.getFullYear()}-${this.twoCharacterDate(date.getMonth()+1)}-${this.twoCharacterDate(date.getDate())}`
  }

  twoCharacterDate(date:any){
    if (String(date).length === 2) return date
    if (String(date).length === 1) return "0" + date
    else return "00"
  }
}

module.exports = new UploadService()