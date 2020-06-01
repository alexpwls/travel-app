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

const geonames_account = process.env.GEONAMES_ACCOUNT;
const geonames_url = process.env.GEONAMES_URL;

const weatherbit_api_key = process.env.WEATHERBIT_API_KEY;
const weatherbit_current_weather_url = process.env.WEATHERBIT_CURRENT_WEATHER_URL;
const weatherbit_forecast_16d_url = process.env.WEATHERBIT_FORECAST_16D_URL;

const pixabay_api_key = process.env.PIXABAY_API_KEY;
const pixabay_url = process.env.PIXABAY_URL;
 
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.listen(8081, function () {
    console.log('App listening on port 8081!')
})

app.post('/get-trip', (req, res) => {
    const requestBody = req.body;
    let data = {};

    data.location = requestBody.location;

    const locationPromise = new Promise((resolve, reject) => {
        geoname(data.location).then(function (response) {
            resolve(response);
        });
    });

    Promise.all([locationPromise]).then(function (results) {
        console.log(results);
    })
})

module.exports = app;

// Geonames api
const geoname = async (location) => {
    const requestURL = geonames_url + 'q=' + location + '&username=' + geonames_account;
    const response = await fetch(requestURL);
    let result = {};
    try {
        result = await response.json();

    } catch (error) {
        console.log('error:', error);
    };
    return result;
}