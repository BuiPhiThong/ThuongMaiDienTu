const express = require('express')
require('dotenv').config()
const dbConnect = require('./config/dbconect')
const initRouter = require('./routes/index')
const cookieParser = require('cookie-parser')
const app = express()

const port = process.env.PORT || 8888

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

dbConnect()
initRouter(app)

// app.use('/', (req, res) => { res.send('SERVER ONNNN') })


app.listen(port, () => {
    console.log('Server runing ' + port);
})