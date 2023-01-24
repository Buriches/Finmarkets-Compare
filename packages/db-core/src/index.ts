const express = require('express')
const marketsRouter = require('./routes/MarketRoutes')
const uniqueProductsRouter = require('./routes/UniqueProductRoutes')
const categoryRouter = require('./routes/CategoryRoutes')
const marketProductRouter = require('./routes/MarketProductRoutes')

const PORT = process.env.PORT || 1400

const app = express()

app.use(express.json())
app.use('/market', marketsRouter)
app.use('/unique', uniqueProductsRouter)
app.use('/category', categoryRouter)
app.use('/market-product', marketProductRouter)

app.listen(PORT, () => console.log(`Server db-core starts on port ${PORT}`))