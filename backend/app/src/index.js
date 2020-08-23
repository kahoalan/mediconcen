require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cors())
app.use(cookieParser())

app.use(require('./auth'))
app.use('/record', require('./record'))

app.use((req, res) => {
  res.status(404).send()
})
app.use((err, req, res, next) => {
  console.log(err)
  res.status(400).send(err)
})


app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});