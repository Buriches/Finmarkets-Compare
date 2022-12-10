export {};
const Router = require('express')
const router = new Router()
const uploadController = require('../controllers/UploadController')

router.get('/update-prisma', uploadController.updatePrisma)
router.get('/update-smarket', uploadController.updateSmarket)
router.get('/update-herkku', uploadController.updateHerkku)
router.get('/update-alepa', uploadController.updateAlepa)
router.get('/update-sale', uploadController.updateSale)
router.get('/update-sokos-herkku', uploadController.updateSokosHerkku)
router.get('/update-mestarin-herkku', uploadController.updateMestarinHerkku)


module.exports = router