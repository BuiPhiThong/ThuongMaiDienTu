const router = require('express').Router()
const ctlrs = require('../controller/blog')
const {isAdmin,verifyToken} = require('../middlewares/verify')

router.put('/dislike/:bid',[verifyToken],ctlrs.dislikeBlog)
router.put('/like/:bid',[verifyToken],ctlrs.likeBlog)
router.get('/:bid',ctlrs.viewBlog)
router.post('/',[verifyToken, isAdmin],ctlrs.createBlog)
router.put('/:bid',[verifyToken, isAdmin],ctlrs.updateBlog)

module.exports=router
