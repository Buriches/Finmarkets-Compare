export {};
const Router = require('express')
const router = new Router()
const gettingProductsController = require('../controllers/GettingProductsController')

router.get('/get24', gettingProductsController.get24)
router.get('/get24withCategory', gettingProductsController.get24withCategory)
router.get('/get1ByPath', gettingProductsController.get1ByPath)
router.get('/getProductsByName/', gettingProductsController.getProductsByName)
router.get('/getMainCategories/', gettingProductsController.getMainCategories)
router.get('/getUnderCategories', gettingProductsController.getUnderCategories)
router.get('/getAllCategories', gettingProductsController.getAllCategories)
router.get('/getProductPrices/:good_id', gettingProductsController.getProductPrices)
router.get('/getSameProducts', gettingProductsController.getSameProducts)
router.get('/getMarkets', gettingProductsController.getMarkets)


module.exports = router