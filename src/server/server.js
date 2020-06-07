const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const fetch = require("node-fetch");
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));

const weatherbit_api_key = process.env.WEATHERBIT_API_KEY;
const weatherbit_current_weather_url = process.env.WEATHERBIT_CURRENT_WEATHER_URL;
const weatherbit_forecast_16d_url = process.env.WEATHERBIT_FORECAST_16D_URL;
const weatherbit_history_url = process.env.WEATHERBIT_HISTORY_URL;

const pixabay_api_key = process.env.PIXABAY_API_KEY;
const pixabay_url = process.env.PIXABAY_URL;

let projectData = {};

app.get('/', function (req, res) {
    res.sendFile(path.resolve('dist/index.html'));
})

app.listen(8081, function () {
    console.log('App listening on port 8081!')
})
let data = {};

app.post('/get-travel-data', (req, res) => {
    let requestBody = req.body;
    data = {};
    data.location = requestBody.data.location;
    data.departing_date = requestBody.data.departing_date;
    data.latitude = requestBody.data.latitude;
    data.longitude = requestBody.data.longitude;
    data.country_name = requestBody.data.countryName;
    data.google_maps = "https://maps.google.com/?q=" + data.latitude + "," + data.longitude + "&z=3&output=embed"
    
    let provided_d = new Date(data.departing_date);
    let providedDate = provided_d.getTime();

    let current_d = new Date();
    let currentDate = current_d.getTime();

    let sixteen_days = 86400000 * 16;

    let weatherbitPromise = new Promise((resolve, reject) => {
        weatherbitCurrent(data.latitude,data.longitude).then(function(responseWeatherbitCurrent){
            resolve(responseWeatherbitCurrent);
        });
    });

    let weatherbitForecastPromise = new Promise((resolve, reject) => {
        weatherbitForecast(data.latitude,data.longitude).then(function(responseWeatherbitForecast){
            resolve(responseWeatherbitForecast);
        });
    });

    if (currentDate + sixteen_days < providedDate) {
        console.log("Provided date is beyond 16 days")
    } else {
        console.log("Provided date is not beyond 16 days");
    }

    let pixabayPromise = new Promise((resolve, reject) => {
        pixabay(data.location).then(function(pixabayResponse){
            resolve(pixabayResponse);
        });
    });

    Promise.all([weatherbitPromise, weatherbitForecastPromise, pixabayPromise]).then(function (results) {
        const weatherbitData = results[0];
        const weatherbitForecastData = results[1];
        const pixabayData = results[2];

        data.weatherbit_data = weatherbitData;
        if (currentDate + sixteen_days < providedDate) {
            console.log("Provided date is beyond 16 days")
            data.weatherbit_forecast_data = null;
        } else {
            console.log("Provided date is not beyond 16 days");
            data.weatherbit_forecast_data = weatherbitForecastData;
        }
        
        data.pixabay_data = pixabayData;

        res.send(data);
    });
})

// Weatherbit get current weather
const weatherbitCurrent = async (lat, lon) => {
    const requestURL = weatherbit_current_weather_url + "?key=" + weatherbit_api_key + "&lang=en" + "&units=M" + "&lat=" + lat + "&lon=" + lon;
    const response = await fetch(requestURL);
    let result = {};
    try {
        result = await response.json();
    } catch (error) {
        console.log('error:', error);
        throw error
    };
    return result;
}

// Weatherbit get forecast weather
const weatherbitForecast = async (lat, lon) => {
    const requestURL = weatherbit_forecast_16d_url + "?key=" + weatherbit_api_key + "&lang=en" + "&units=M" + "&lat=" + lat + "&lon=" + lon + "&days=7";
    const response = await fetch(requestURL);
    let result = {};
    try {
        result = await response.json();
    } catch (error) {
        console.log('error:', error);
        throw error
    };
    return result;
}

// Pixabay get image
const pixabay = async (location) => {
    const requestURL = pixabay_url + "?key=" + pixabay_api_key + "&q=" + location + "&image_type=photo" + "&category=travel" + "&per_page=3";
    const response = await fetch(requestURL);
    let result = {};
    try {
        result = await response.json();
    } catch (error) {
        console.log('error:', error);
        throw error
    };
    return result;
}

module.exports = app;