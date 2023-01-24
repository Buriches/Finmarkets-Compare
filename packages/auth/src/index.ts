export {}
const express = require('express')
const authRouter = require('./routes/AuthRoutes')

const PORT = process.env.PORT || 1550

const app = express()

app.use(express.json())
app.use('/reg', authRouter)



app.listen(PORT, () => console.log(`Server auth starts on port ${PORT}`))