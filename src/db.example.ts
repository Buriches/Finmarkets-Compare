export {}
const Pool = require('pg').Pool
const pool = new Pool({
    user: "user",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "database-name"
})

module.exports = pool
