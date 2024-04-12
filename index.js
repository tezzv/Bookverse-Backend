const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('This is backend server for Bookverse')
})

app.use(cors({
  origin: "*",
}))
app.use(express.json());

// console.log(express.json);
// Available Routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/books', require('./routes/books'));



app.listen(port, () => {
  console.log(`bookverse backend listening at http://localhost:${port}`)
})