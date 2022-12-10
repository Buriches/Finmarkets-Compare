const express = require('express')
const marketsRouter = require('./routes/MarketRoutes')
const uniqueProductsRouter = require('./routes/UniqueProductRoutes')
const categoryRouter = require('./routes/CategoryRoutes')
const productsCategoryRouter = require('./routes/ProductCategoryRoutes')
const marketProductRouter = require('./routes/MarketProductRoutes')
const gettingProductsRouter = require('./routes/GettingProductsRoutes')
const authRouter = require('./auth/routes/AuthRoutes')

const uploadRouter = require('./routes/UploadRoutes')

const PORT = process.env.PORT || 1488

const app = express()

app.use(express.json())
app.use('/market', marketsRouter)
app.use('/unique', uniqueProductsRouter)
app.use('/category', categoryRouter)
app.use('/products-category', productsCategoryRouter)
app.use('/market-product', marketProductRouter)
app.use('/upload', uploadRouter)
app.use('/get', gettingProductsRouter)
app.use('/reg', authRouter)



app.listen(PORT, () => console.log(`Server starts on port ${PORT}`))