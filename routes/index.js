const userRouter= require('./user')
const prodRouter = require('./product')
const blogRouter = require('./blog')
const { errHandler,notFound} = require('../middlewares/err')

const initRoutes = (app) => {
    app.use('/api/user',userRouter)

    app.use('/api/product',prodRouter)

    app.use('/api/blog',blogRouter)
    
    app.use(notFound)
    app.use(errHandler)
    
}

module.exports = initRoutes