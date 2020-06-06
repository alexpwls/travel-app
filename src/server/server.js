const dotenv = require('dotenv');
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

const geonames_account = process.env.GEONAMES_ACCOUNT;
const geonames_url = process.env.GEONAMES_URL;

const weatherbit_api_key = process.env.WEATHERBIT_API_KEY;
const weatherbit_current_weather_url = process.env.WEATHERBIT_CURRENT_WEATHER_URL;
const weatherbit_forecast_16d_url = process.env.WEATHERBIT_FORECAST_16D_URL;

const pixabay_api_key = process.env.PIXABAY_API_KEY;
const pixabay_url = process.env.PIXABAY_URL;

let projectData = {};

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

app.listen(8081, function () {
    console.log('App listening on port 8081!')
})

app.post('/lat-lon', (req, res) => {
    const requestBody = req.body;
    let data = {};
    data.location = requestBody.data.location;

    const locationPromise = new Promise((resolve, reject) => {
        geoname(data.location).then(function(response){
            if(response.geonames[0] != undefined) {
                data.country = response.geonames[0].countryName;
                data.lat = response.geonames[0].lat;
                data.lon = response.geonames[0].lng;
                weatherbitCurrent(data.lat,data.lon).then(function(responseWeatherbitCurrent){
                    data.timezone = responseWeatherbitCurrent.data[0].timezone;
                    data.temp = responseWeatherbitCurrent.data[0].temp;
                    data.weather_icon = responseWeatherbitCurrent.data[0].weather.icon;
                    data.weather_code = responseWeatherbitCurrent.data[0].weather.code;
                    data.weather_description = responseWeatherbitCurrent.data[0].weather.description;
                })
                weatherbitForecast(data.lat,data.lon).then(function(responseWeatherbitForecast){
                    //console.log(responseWeatherbitForecast);
                    let forecastData = [{}]
                    for (i in responseWeatherbitForecast.data) {
                        let day = {}
                        day.temp = responseWeatherbitForecast.data[i].temp;
                        day.datetime = responseWeatherbitForecast.data[i].datetime;
                        forecastData += day;
                    }
                    console.log(forecastData)
                })
                pixabay(data.location).then(function(pixabayResponse){
                    // console.log(pixabayResponse)
                    // console.log(pixabayResponse.hits[0].webformatURL.toString());
                    // data.page_url = pixabayResponse.hits[0].pageURL;
                })
                resolve("Geoname API was succesfully called!");
            } else {
                reject("Something went wrong when calling Geoname API.")
            }
        });
    });

    locationPromise.then(( message ) => {
        console.log(message);
        console.log(data);
        res.send(data);
    })
    .catch((err) => {
        console.log(err);
    });

})

module.exports = app;

// Geonames api
const geoname = async (location) => {
    const requestURL = geonames_url + 'q=' + location + '&username=' + geonames_account + '&maxRows=1';
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
