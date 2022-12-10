export {};
const Router = require('express')
const router = new Router()
const uniqueProductsController = require('../controllers/UniqueProductController')

router.post('/', uniqueProductsController.create)
router.get('/', uniqueProductsController.getAll)
router.get('/:id', uniqueProductsController.getOne)
router.put('/', uniqueProductsController.update)
router.delete('/:id', uniqueProductsController.delete)
router.get('get-one-by-name/:name', uniqueProductsController.getOneByName)

module.exports = router