const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/User')
const categoryRouter = require('./routes/Category')
const productRouter = require('./routes/Product')
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(categoryRouter)
app.use(productRouter)
const PORT = process.env.PORT || 6000

app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`)
})
