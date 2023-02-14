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
const modeBtn = $('.mode');
const modeIcon = $('#mode-icon');

let isDay = true;
let currentIndex = 0;

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
    city.value = '';
    if (city_name) {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city_name}&days=3&aqi=no&alerts=yes`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    renderWeather(data);
                    renderDayForecast(data);
                    activeDayForecast();
                    handleEvents(data);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
}

function getWeatherWithLocation() {
    // Get user's location using the Geolocation API
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // fetch weather api with user's location
            getWeatherData(`${lat} ${lon}`);
        },
        (err) => console.log(err),
    );
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

    const htmls = forecastDays.map((forecast, index) => {
        return `<div class="forecast" data-index='${index}'">
                    <h2 class="forecast-date">${dateToWords(forecast.date)}</h2>
                    <div class="forecast-data">
                        <i class="fa-solid ${findIcon(forecast.day.condition.text)} forecast-icon" ></i>
                        <div class="humidity-data">
                            <h3>Humidity</h3>
                            <h2 class="humidity-value">${forecast.day.avghumidity}%</h2>
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
        const forecastNode = event.target.closest('.forecast');
        if (forecastNode) {
            const index = forecastNode.getAttribute('data-index');
            createChart(forecastDays[index]);
            // update current index and active day forecast
            currentIndex = index;
            activeDayForecast();
        }
    };
    //toggle day night mode
    modeBtn.onclick = () => {
        isDay = !isDay;
        changeBg(isDay);
    };
}

function activeDayForecast() {
    const forecastNodeList = $$('.forecast');
    const activeNode = $('.forecast.active');
    if (activeNode) {
        activeNode.classList.remove('active');
    }
    forecastNodeList.forEach((fNode) => {
        if (fNode.dataset.index == currentIndex) {
            fNode.classList.add('active');
        }
    });
}

function changeBg(bool) {
    if (document.body) {
        const hour = new Date().getHours();
        isDay = bool ?? (hour >= 6 && hour < 18);
        document.body.style = `background-image:  linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url(${
            isDay ? './assets/images/cloud.jpg' : './assets/images/night.jpg'
        });`;

        if (isDay) {
            modeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            modeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }
}

window.onload = () => {
    getWeatherWithLocation();
    changeBg();
};

form.onsubmit = (e) => {
    e.preventDefault();
    getWeatherData();
};
