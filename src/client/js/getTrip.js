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
            const newData = await response.json();
            console.log(newData);
            return newData
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
}

export { getTrip };