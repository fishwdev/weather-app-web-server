const fs = require("fs");
const request = require("postman-request");
const ACCESS_TOKEN = require('../ACCESS_KEY');

const WEATHERSTACK_BASE_URL = 'http://api.weatherstack.com';
const WEATHERSTACK_ACCESS_KEY = ACCESS_TOKEN.WEATHERSTACK_ACCESS_KEY;

const forecast = (latitude, longitude, callback) => {
    const weatherStackURL = `${WEATHERSTACK_BASE_URL}/current?access_key=${WEATHERSTACK_ACCESS_KEY}&query=${latitude},${longitude}`;
    request({uri: weatherStackURL, json: true}, (e, response) => {
        if (e) {
            callback('Unable to connect to weatherstack.', undefined);
        }
        else if (response.body.error) {
            callback('Weatherstack server error due to the geocode.', undefined);
        }
        else {
            const weatherStackData = response.body.current;
            fs.writeFileSync('weatherStackResponse.json', JSON.stringify(response.body));
            callback(undefined, {temperature: weatherStackData.temperature, humidity: weatherStackData.humidity});
        }
    });
}

module.exports = forecast;