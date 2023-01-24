export {}
const express = require('express')
const gettingProductsRouter = require('./routes/GettingProductsRoutes')
const PORT = process.env.PORT || 1500

const app = express()

app.use(express.json())
app.use('/get', gettingProductsRouter)

app.listen(PORT, () => console.log(`Server api starts on port ${PORT}`))