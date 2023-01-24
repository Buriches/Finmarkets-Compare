export {};
const Router = require('express')
const router = new Router()
const gettingProductsController = require('../controllers/GettingProductsController')

router.get('/get24/:from', gettingProductsController.get24)
router.get('/get24withCategory/', gettingProductsController.get24withCategory)
router.get('/getProductsByName/', gettingProductsController.getProductsByName)
router.get('/getMainCategories/', gettingProductsController.getMainCategories)
router.get('/getUnderCategories/', gettingProductsController.getUnderCategories)
router.get('/getProductPrices/:good_id', gettingProductsController.getProductPrices)
router.get('/getSameProducts', gettingProductsController.getSameProducts)


module.exports = router