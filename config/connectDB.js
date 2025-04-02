const mysql = require('mysql2'); 
const dotenv = require('dotenv');
dotenv.config()

// Create a connection pool 
const pool = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD, 
    database: process.env.DATABASE, 
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
}).promise();

module.exports = pool;