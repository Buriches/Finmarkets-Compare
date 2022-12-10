export {};
const Router = require('express')
const router = new Router()
const categoryController = require('../controllers/CategoryController')

router.post('/', categoryController.create)
router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getOne)
router.get('/:name', categoryController.getOneByName)
router.put('/', categoryController.update)
router.delete('/:id', categoryController.delete)

module.exports = router