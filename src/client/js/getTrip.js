function getTrip() {
    let location = document.getElementById('location').value;
    let departingDate = document.getElementById('departing-date').value;
    const url = 'http://localhost:8081/lat-lon';

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

    postData(url, {location: location, departing_date: departingDate})
}

export { getTrip };