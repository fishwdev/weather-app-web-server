const fs = require("fs");
const request = require("postman-request");
const ACCESS_TOKEN = require('../ACCESS_KEY');

const MAPBOX_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const MAPBOX_SEARCH_LIMIT = 1;
const MAPBOX_ACCESS_TOKEN = ACCESS_TOKEN.MAPBOX_ACCESS_TOKEN;

const geocode = (location, getWeather) => {
    const mapboxURL = `${MAPBOX_BASE_URL}${encodeURIComponent(location)}.json?limit=${MAPBOX_SEARCH_LIMIT}&access_token=${MAPBOX_ACCESS_TOKEN}`;
    request({uri: mapboxURL, json: true}, (e, response) => {
        if (e) {
            getWeather('Unable to connect mapbox.', undefined);
        }
        else if (!response.body.features.length) {
            getWeather('Mapbox server error due to the location provided.', undefined);
        }
        else {
            const mapboxData = response.body.features[0];
            fs.writeFileSync('mapboxResponse.json', JSON.stringify(response.body));
            getWeather(undefined, {
                place_name: mapboxData.place_name,
                latitude: mapboxData.center[1],
                longitude: mapboxData.center[0]
            });
        }
    });
}

module.exports = geocode;