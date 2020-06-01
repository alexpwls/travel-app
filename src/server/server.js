const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));
 
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

module.exports = app;