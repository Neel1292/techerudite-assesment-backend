const express = require('express');
const app = express()
const db = require("./config/connectDB")
require("dotenv").config();

const authRoute = require('./routes/authRoute');

const PORT = parseInt(process.env.PORT) || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
  res.send('Hello, Techerudite!');
});


db.query("SELECT 1")
  .then(() => console.log("DB Connected.."))
  .catch((err) => console.error("DB Connection Failed:", err));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})