require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

const userRouter = require('./router/user')
const boardRouter = require('./router/board')

// connected mongodb
const connectDB = require('./config/database')
connectDB()

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use(morgan('dev'))

// connected router
app.use('/user', userRouter)
app.use('/board', boardRouter)

app.use('/uploads', express.static('uploads'))

const PORT = process.env.PORT || 7000

app.listen(PORT, console.log("connected server..."))