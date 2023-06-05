export {}
const express = require('express')
const gettingProductsRouter = require('./routes/GettingProductsRoutes')
const PORT = process.env.PORT || 1500

const app = express()
app.use(function(req: any, res: any, next: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, application/json');
  next();
});
app.use(express.json())
app.use('/get', gettingProductsRouter)

app.listen(PORT, () => console.log(`Server api starts on port ${PORT}`))