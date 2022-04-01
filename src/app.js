const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require("../utils/geocode");
const forecast = require("../utils/forecast");

// Express's config
const publicFilePath = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../templates/partials');
const viewsPath = path.join(__dirname, '../templates/views');

const app = express();
const port = process.env.PORT || 3000;

// settings for hbs engines and views directory
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// static directory to serve
app.use(express.static(publicFilePath));

// app.com
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'index'
    });
});

// app.com/about
app.get('/about', (req, res) => {
    //res.sendFile(path.join(publicFilePath, '/about.html'));
    res.render('about', {
        title: 'Weather App',
        name: 'about'
    });
});

// app.com/help
app.get('/help', (req, res) => {
    //res.sendFile(path.join(publicFilePath, '/help.html'));
    res.render('help', {
        title: 'Weather App',
        helpText: 'If you want to seek for help...'
    });
});

// app.com/help/*
app.get('/help/*', (req, res) => {
    res.render('PAGE_NOT_FOUND', {
        title: 'Not found',
        errorMsg: 'Help article not found'
    });
});

// app.com/weather
app.get('/weather', (req, res) => {
    if (!req.query.location) {
        res.send({
            error: 'location parameter is required.'
        })
        return;
    }
    const {location} = req.query;
    geocode(location, (error, locationData) => {
        if (error) {
            res.send({error});
            return;
        }
        forecast(locationData.latitude, locationData.longitude, (error, weatherData) => {
            if (error) {
                res.send({error});
                return;
            }
            const {temperature, humidity} = weatherData;
            res.send({
                weatherData,
                typedLocation: location,
                forecastLocation: locationData.place_name,
                forecast: `It is currently ${weatherData.temperature} degrees out. The humidity is ${weatherData.humidity}%.`,
                temperature,
                humidity
            });
        });
    });
});

app.get('*', (req, res) => {
    res.render('PAGE_NOT_FOUND', {
        title: 'Not found',
        errorMsg: '404 Page not found'
    });
});

app.listen(port, () => {
    console.log(`server started on port ${port}.`);
});
