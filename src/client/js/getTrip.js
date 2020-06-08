function getTrip() {

    // Get provided data
    let location = document.getElementById('location').value;
    let departingDate = document.getElementById('departing-date').value;

    // Set URL for server side API
    const url = 'http://localhost:8081/get-travel-data';
    const errorSection = document.querySelector('.error-text');

    const postData = async (url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST', 
            credentials: 'same-origin', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data}),
        });

        try {
            const TravelData = await response.json();
            return updateUI(TravelData);
        } catch(error) {
            console.log("error", error);
        }
    }

    // Check if data is provided
    if (location && departingDate) {
        // Call Geoname API to get latitude and longitude
        Client.geonameAPI(location)
        // When latitude and longitude is received send it to backend together with the provided data
        .then((data) => {
            postData(url, {
                location: data.geonames[0].name,
                departing_date: departingDate,
                latitude: data.geonames[0].lat,
                longitude: data.geonames[0].lng,
                countryName: data.geonames[0].countryName
            });
        })
    } else if (location) {
        document.querySelector('.error').style.display = "block";
        errorSection.innerHTML = "Please enter a date";
    } else if (departingDate) {
        document.querySelector('.error').style.display = "block";
        errorSection.innerHTML = "Please enter a location";
    } else {
        document.querySelector('.error').style.display = "block";
        errorSection.innerHTML = "Please fill in all the fields❗";
    }

    // Forecast HTML codeblock function for inserting content
    function forecastHTML(forecastData) {
        return `<div class="weather-box">
                <img src="https://www.weatherbit.io/static/img/icons/${forecastData.weather.icon}.png">
                <p>Min.</p>
                <p id="min-temp">${forecastData.min_temp} °C</p>
                <p>Max.</p>
                <p id="max-temp">${forecastData.max_temp} °C</p>
                <p id="forecast-date">${forecastData.datetime.substr(forecastData.datetime.length - 5)}</p>
                </div>`;
    }

    const forecastSection = document.querySelector('.weather-forecast-content');

    // Update the UI with received data
    function updateUI(TravelData) {
        let temp = TravelData.weatherbit_data.data[0].temp
        let weather_icon = "https://www.weatherbit.io/static/img/icons/" + TravelData.weatherbit_data.data[0].weather.icon + ".png"
        let weather_description = TravelData.weatherbit_data.data[0].weather.description

        document.getElementById('country').innerHTML = "About " + TravelData.country_name;
        document.getElementById('figcaption').innerHTML = TravelData.country_name;
        document.getElementById('google-maps-link').src = TravelData.google_maps;
        document.getElementById('current-icon').src = weather_icon;
        document.getElementById('current-temp').innerHTML = temp + " °C";
        document.getElementById('current-description').innerHTML = weather_description;
        let item = {}
        forecastSection.innerHTML = '';

        // Forecast data can contain up to 7 items, loop through them and display them in the front-end
        if (TravelData.weatherbit_forecast_data != null) {
            for(item in TravelData.weatherbit_forecast_data.data) {
                forecastSection.insertAdjacentHTML('beforeend', forecastHTML(TravelData.weatherbit_forecast_data.data[item]));
            }
        } else {
            document.querySelector('.weather-forecast-content').style.display = "none";
        }

        document.getElementById('destination-image').src = TravelData.pixabay_data.hits[0].webformatURL;
        document.querySelector('.travel-result').style.display = "block";
    }
}

export { getTrip };