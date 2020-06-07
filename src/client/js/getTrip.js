function getTrip() {
    let location = document.getElementById('location').value;
    let departingDate = document.getElementById('departing-date').value;
    const url = 'http://localhost:8081/get-travel-data';

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

    Client.geonameAPI(location)
    .then((data) => {
        postData(url, {
            location: data.geonames[0].name,
            departing_date: departingDate,
            latitude: data.geonames[0].lat,
            longitude: data.geonames[0].lng,
            countryName: data.geonames[0].countryName
        });
    })

    function forecastHTML(forecastData) {
        return `<li>
                <img src="https://www.weatherbit.io/static/img/icons/${forecastData.weather.icon}.png">
                <p>${forecastData.min_temp}</p>
                <p>${forecastData.max_temp}</p>
                <p>${forecastData.datetime}</p>
                </li>`;
    }

    const forecastSection = document.getElementById('forecast-data');

    function updateUI(TravelData) {
        let temp = TravelData.weatherbit_data.data[0].temp
        let weather_icon = "https://www.weatherbit.io/static/img/icons/" + TravelData.weatherbit_data.data[0].weather.icon + ".png"
        let weather_description = TravelData.weatherbit_data.data[0].weather.description

        document.getElementById('country').innerHTML = TravelData.country_name;
        document.getElementById('google-maps-link').href = TravelData.google_maps;
        document.getElementById('current-temp').innerHTML = temp;
        document.getElementById('current-icon').src = weather_icon;
        document.getElementById('current-description').innerHTML = weather_description;
        let item = {}
        for(item in TravelData.weatherbit_forecast_data.data) {
            forecastSection.insertAdjacentHTML('beforeend', forecastHTML(TravelData.weatherbit_forecast_data.data[item]));
        }
        document.getElementById('destination-image').src = TravelData.pixabay_data.hits[0].webformatURL;
    }
}

export { getTrip };