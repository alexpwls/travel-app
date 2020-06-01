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
        .then(res => res.json())
        .then(function(res) {
            console.log(res);
        })
    }
}

export { getTrip };