export {};
const Router = require('express')
const router = new Router()
const marketController = require('../controllers/MarketController')

router.post('/', marketController.create)
router.get('/', marketController.getAll)
router.get('/:id', marketController.getOne)
router.put('/', marketController.update)
router.delete('/:id', marketController.delete)
router.get('/get-one-by-name/:name', marketController.getOneByName)

module.exports = router