function getTrip() {
    let location = document.getElementById('location').value;
    let departingDate = document.getElementById('departing-date').value;

    if (location) {
        const url = 'http://localhost:8081/lat-lon';
        fetch(url, {
            method: 'POST', 
            credentials: 'same-origin', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({location}),
        })
        .then(function(response) {
            console.log('test');
            console.log(response.json());
        })
    }
}

export { getTrip };