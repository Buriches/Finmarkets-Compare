const axios = require('axios')
import {IStatusResponse} from "../types";
import async from 'async';
//const {Mutex} = require('async-mutex')

//const mutex = new Mutex();


const UniqueProductService = require('./UniqueProductService')
const CategoryService = require('./CategoryService')
const MarketProductService = require('./MarketProductService')
const MarketService = require('./MarketService')
const ProductCategoryService = require('./ProductCategoryService')

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
      await this.updateLogic(this.decodeMarket('prisma'))
      return {status: 200, response: "prisma finished"}
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
  }

  async updateSmarket(): Promise<IStatusResponse>{
    try {
        await this.updateLogic(this.decodeMarket('s-market'))
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "s-market finished"}
  }

  async updateHerkku(): Promise<IStatusResponse>{
    try {
      await this.updateLogic(this.decodeMarket('herkku'))
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "herukku finished"}
  }

  async updateAlepa(): Promise<IStatusResponse>{
    try {
      await this.updateLogic(this.decodeMarket('alepa'))
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "alepa finished"}
  }

  async updateSale(): Promise<IStatusResponse>{
    try {
      const scope = this
      async.waterfall([
          function market (callback:any) {
            const market = scope.decodeMarket('sale')
            callback(null, market)
          },
          function (market:any, callback:any) {
            const logic = scope.updateLogic(market)
            callback(null, logic)
          },
      ], (error, result) => {
        if (error) {
          console.log(error)
          return
        }
        console.log(result)
      })
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "sale finished"}
  }

  async updateSokosHerkku(): Promise<IStatusResponse>{
    try {
      await this.updateLogic(this.decodeMarket('sokos-herkku'))
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "sokos-herkku finished"}
  }

  async updateMestarinHerkku(): Promise<IStatusResponse>{
    try {
      await this.updateLogic(this.decodeMarket('mestarin-herkku'))
    } finally {
      console.log('Download is finished. Database is currently being loaded')
    }
    return {status: 200, response: "mestarin-herkku finished"}
  }


  private async updateLogic(market:string|number){
    // work with market table
    const market_id = await this.updateMarket(market)
    let i = 0
    const step = 4000
    let arr:any[] = []
    let total = 0
    while(true){
      i += step
      const res = await this.uploadQuery(step, i - step, market)
      total += res.data.store.products.items.length
      console.log(res.data.store.products.items.length + " total: " + total)
      if (res.data.store.products.items.length === 0) {
        break
      }
      arr.push(...res.data.store.products.items)
    }
    await this.addToBd(arr, market_id)
  }

  private async addToBd(arr:any[], market_id:number){
    console.log(arr.length)
    arr.forEach(async (item) => {

      // work with category
      const getArrCategories = async () => {
        let categories:any[] = []
        if(item.hierarchyPath !== null && item.hierarchyPath !== undefined){
          for (let i = 0; i < item.hierarchyPath.length; i++){
            categories = [...categories, await this.updateCategory(item.hierarchyPath[i].name, item.hierarchyPath[i].slug)]
          }
        }else{
          return []
        }
        return categories
      }

      // work with product
      const product = {
        name: item.name,
        for_adults: item.isAgeLimitedByAlcohol,
        path: item.slug,
        brand: item.brandName,
        img: item.ean,
        categories: await getArrCategories()
      }

      const good_id = await this.updateUniqueProducts(product)


      const body:{market_id: number, good_id: number | undefined, price: number, price_unit: string, price_compare: number, compare_unit: string} = {
        market_id: market_id,
        good_id: good_id,
        price: parseFloat(item.price.toFixed(2)),
        price_unit: item.priceUnit,
        price_compare: item.comparisonPrice,
        compare_unit: item.comparisonUnit
      }
      await this.updateMarketProduct(body)
    })
  }



  private async updateMarket(market:string|number){

    const query = await MarketService.getOneByName(this.decodeMarket(market))
    if (query?.response.market_id) return query.response.market_id
    return 999

  }

  private async updateUniqueProducts(product: {name: string, for_adults: boolean, path: string, brand: string, img: string, categories: any[]}){
    //if(this.localUniqueProducts.find(item => item.name = product.name))
    //  return this.localUniqueProducts.find(item => item.name = product.name)?.good_id
    const query = await UniqueProductService.getOneByName(product.name)
    if (query.response?.good_id) {
      this.localUniqueProducts.push(query.response)
      return this.localUniqueProducts.find(item => item.name = product.name)?.good_id
    }

    //create new unique product
    const createUniqueProduct = (await UniqueProductService.create(product)).response
    this.localUniqueProducts.push(createUniqueProduct)
    //console.log(this.localUniqueProducts)
    return this.localUniqueProducts.find(item => item.name = product.name)?.good_id
  }

  private async updateCategory(name:string, path:string){
    //const release = await mutex.acquire();
    try {
      if (this.localCategories.find(item => item.name = name))
        return this.localCategories.find(item => item.name = name)?.category_id
      const query = await CategoryService.getOneByName(name)
      if (query.response?.category_id) {
        this.localCategories.push(query.response)

        return this.localCategories.find(item => item.name = name)?.category_id
      }
      const body = {
        name: name,
        path: path
      }

      //create new category

      const createCategory = (await CategoryService.create(body)).response
      this.localCategories.push(createCategory)
      return this.localCategories.find(item => item.name = name)?.category_id
    } finally {
      //release()
    }
  }

  private async updateMarketProduct(body:{market_id: number, good_id: number | undefined, price: number, price_unit: string, price_compare: number, compare_unit: string}){

    const query = await MarketProductService.searchByProductAndMarket(body)
    if (query?.market_product_id) {
      //console.log(query)
      //console.log(body)
      return
    }
    return (await MarketProductService.create(body)).response
  }

  // private async updateProductCategory(good_id:number, category_id:number){
  //   const query = await ProductCategoryService.getRelation({"good_id": good_id, "category_id": category_id})
  //   if (query?.products_category_id) return
  //   const body = {
  //     good_id: good_id,
  //     category_id: category_id
  //   }
  //
  //   return (await ProductCategoryService.create(body)).response.product_category_id
  // }F

  async uploadQuery(limit:number, from:number, market:string|number){
    if (from > 100) return {data: {store: {products: {items :{length: 0}}}}}
    const res = await axios.get(' http://localhost:3000/data')
    //res.data.store.products.items.length = 2500
    return res
    //return await axios.get(this.queryForDownloadDataBase(limit, from, market))
  }

  queryForDownloadDataBase(limit:number, from:number, market:string|number){
    return `https://cfapi.voikukka.fi/graphql?operationName=RemoteFilteredProducts&variables=%7B%22includeAvailabilities%22%3Afalse%2C%22availabilityDate%22%3A%22${this.nowDate()}%22%2C%22facets%22%3A%5B%7B%22key%22%3A%22brandName%22%2C%22order%22%3A%22asc%22%7D%2C%7B%22key%22%3A%22labels%22%7D%5D%2C%22includeAgeLimitedByAlcohol%22%3Atrue%2C%22limit%22%3A${limit}%2C%22queryString%22%3A%22%22%2C%22searchProvider%22%3A%22loop54%22%2C%22slug%22%3A%22%22%2C%22storeId%22%3A%22${market}%22%2C%22useRandomId%22%3Atrue%2C%22from%22%3A${from}%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2226a6b5c304cad94a10172684a0dbd25da74a400a7cbe72a862352902362fe538%22%7D%7D`
  }

  nowDate(){
    const date = new Date()
    return `${date.getFullYear()}-${this.twoCharacterDate(date.getMonth()+1)}-${this.twoCharacterDate(date.getDate())}`
  }

  twoCharacterDate(date:any){
    if (new String(date).length === 2) return date
    if (new String(date).length === 1) return "0" + date
    else return "00"
  }

  decodeMarket(acquiredInformation: string|number){
    if (typeof acquiredInformation === "number"){
      switch (acquiredInformation){
        case acquiredInformation = 513971200: return 'prisma'
        case acquiredInformation = 725814659: return 'smarket'
        case acquiredInformation = 720571157: return 'herkku'
        case acquiredInformation = 708268115: return 'alepa'
        case acquiredInformation = 725782447: return 'sale'
        case acquiredInformation = 542854294: return 'sokos-herkku'
        case acquiredInformation = 519684690: return 'mestarin-herkku'
      }
    }
    if (typeof acquiredInformation === "string"){
      switch (acquiredInformation){
        case acquiredInformation = 'prisma': return 513971200
        case acquiredInformation = 'smarket': return 725814659
        case acquiredInformation = 'herkku': return 720571157
        case acquiredInformation = 'alepa': return 708268115
        case acquiredInformation = 'sale': return 725782447
        case acquiredInformation = 'sokos-herkku': return 542854294
        case acquiredInformation = 'mestarin-herkku': return 519684690
      }
    }
    console.log('ERROR MARKET NAME')
    return 'error'
  }
}

module.exports = new UploadService()