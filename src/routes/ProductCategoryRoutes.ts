export {};
const Router = require('express')
const router = new Router()
const ProductsCategoryController = require('../controllers/ProductCategoryController')

router.post('/', ProductsCategoryController.create)
router.get('/', ProductsCategoryController.getAll)
router.get('/:id', ProductsCategoryController.getOne)
router.put('/', ProductsCategoryController.update)
router.delete('/:id', ProductsCategoryController.delete)
router.get('/get-product-categories/:id', ProductsCategoryController.getProductCategories)
router.get('/get-relation/', ProductsCategoryController.getRelation)

module.exports = router