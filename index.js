const express = require('express');
const app = express()
const dotenv = require('dotenv');
dotenv.config()

const PORT = parseInt(process.env.PORT) || 5000;

app.get('/', (req, res) => {
  res.send('Hello, Techerudite!');
});

app.listen(PORT, () => {
    console.log(`Server running http://locahost:${PORT}`);
});