// Geoname API used for getting Latitude and Longitude based on location
function geonameAPI(location) {
    const url = 'http://api.geonames.org/searchJSON?q=' + location + '&username=alexpwls&maxRows=1';
    const getGeoData = async (url) => {
        const response = await fetch(url);
        try {
            const result = await response.json();
            return result
        } catch (error) {
            console.log('error', error);
            return null;
        }
    }

    return getGeoData(url);
}

export { geonameAPI };