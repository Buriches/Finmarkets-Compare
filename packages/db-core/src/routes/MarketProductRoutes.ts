export {};
const Router = require('express')
const router = new Router()
const marketProductController = require('../controllers/MarketProductController')

router.post('/', marketProductController.create)
router.get('/', marketProductController.getAll)
router.get('/:id', marketProductController.getOne)
router.put('/', marketProductController.update)
router.delete('/:id', marketProductController.delete)
router.get('/search-by-product-and-market', marketProductController.searchByProductAndMarket)

module.exports = router