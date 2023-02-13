import { dateToWords, findIcon, setInnerText } from './utils.js';
import { createChart } from './tempChart.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const API_KEY = '0da9f94584ff40e0b9231015230802';
const form = $('#location-form');
const tempEl = $('#temp');
const locationEL = $('.location');
const dateTimeEl = $('.date-time');
const city = $('#city-name');
const weatherIcon = $('#weather-icon');
const weatherText = $('#weather-text');
const pressureEl = $('#pressure-data');
const windEl = $('#wind-data');
const weather = $('.weather-details');

// Format the time and date
const time = new Date().toLocaleTimeString('en-us', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
});

const date = new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

function getWeatherData(value) {
    const city_name = value ?? city.value;
    if (city_name) {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city_name}&days=3&aqi=no&alerts=yes`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                renderWeather(data);
                renderDayForecast(data);
                handleEvents(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
}

function renderWeather(data) {
    setInnerText(tempEl, data.current.temp_c);
    setInnerText(locationEL, data.location.name);
    setInnerText(dateTimeEl, `${time} - ${date}`);
    setInnerText(weatherText, data.current.condition.text);
    setInnerText(pressureEl, data.current.pressure_mb);
    setInnerText(windEl, data.current.wind_mph);
    const iconClassName = `fa-solid ${findIcon(data.current.condition.text)}`;
    weatherIcon.className = iconClassName;
}

function renderDayForecast(data) {
    const forecastDays = data?.forecast?.forecastday;
    createChart(forecastDays[0]);

    const htmls = forecastDays.map((day, index) => {
        return `<div class="forecast" data-index='${index}'">
                    <h2 class="forecast-date">${dateToWords(day.date)}</h2>
                    <div class="forecast-data">
                        <i class="fa-solid ${findIcon(
                            day.day.condition.text,
                        )} forecast-icon" style="font-size: 4rem"></i>
                        <div class="humidity-data">
                            <h3>Humidity</h3>
                            <h2 class="humidity-value">99%</h2>
                        </div>
                    </div>
                </div>`;
    });
    // clear old forecast elements before add new one
    const forecastEls = $$('.forecast');
    forecastEls?.forEach((el) => el.remove());
    weather.insertAdjacentHTML('beforeend', htmls.join(''));
}

function handleEvents(data) {
    const forecastDays = data?.forecast?.forecastday;
    //handle event click on day forecast
    weather.onclick = (event) => {
        if (event.target.classList.contains('forecast')) {
            const index = event.target.getAttribute('data-index');
            createChart(forecastDays[index]);
        }
    };
}
window.onload = () => {
    getWeatherData('VietNam');
};

form.onsubmit = (e) => {
    e.preventDefault();
    getWeatherData();
};
