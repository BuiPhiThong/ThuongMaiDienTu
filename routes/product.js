const router = require('express').Router()
const ctrls = require('../controller/product')
const {verifyToken,isAdmin} = require('../middlewares/verify')


router.get('/',ctrls.productConditional)
router.post('/create',[verifyToken, isAdmin],ctrls.createProduct)
router.get('/listall',[verifyToken, isAdmin],ctrls.getAllProduct)
router.put('/rating',[verifyToken],ctrls.ratings)
router.delete('/delete/:pid',[verifyToken, isAdmin],ctrls.deleteProduct)
router.put('/update/:pid',[verifyToken, isAdmin],ctrls.updateProduct)


module.exports= router