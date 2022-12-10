export {}
const Router = require('express')
const router = new Router()
const authController = require('../controllers/AuthController')
const {check} = require('express-validator');
const authMiddleware = require('../../middleware/authMiddleware')

router.post('/registration', [
  check('username', 'Should not be empty').notEmpty(),
  check('password', 'Should be more than 6 and smaller then 20').isLength({min: 6, max: 20}),
  check('username', 'Should be more than 2 and smaller then 20').isLength({min: 2, max: 20})
], authController.registration)
router.post('/login', authController.login)
router.get('/users', authMiddleware ,authController.getUsers)
router.put('/confirm-registration', authController.confirmRegistration)

module.exports = router