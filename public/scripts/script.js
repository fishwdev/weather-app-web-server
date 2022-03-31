console.log('script running...');

const weatherForm = document.querySelector('form');
const locationInput = document.querySelector('input');
const generalParagraph = document.querySelector('#general-message');
const weatherParagraph = document.querySelector('#weather-message');

weatherForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    errorParagraph.textContent = 'loading...';
    weatherParagraph.textContent = '';

    const location = locationInput.value;
    fetch(`http://localhost:3000/weather?location=${location}`).then(res => {
        res.json().then(data => {
            if(data.error) {
                generalParagraph.textContent = data.error;
                return;
            }

            generalParagraph.textContent = data.forecastLocation;
            weatherParagraph.textContent = data.forecast;

            locationInput.value = '';
        });
    });
});