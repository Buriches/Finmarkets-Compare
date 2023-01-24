export {}
const express = require('express')

const uploadRouter = require('./routes/UploadRoutes')

const PORT = process.env.PORT || 1450

const app = express()

app.use(express.json())

app.use('/upload', uploadRouter)

app.listen(PORT, () => console.log(`Server db-loader starts on port ${PORT}`))