const apiKey = "8b5546cda6f5f19b75c0a17daab06b19";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const citySunrise = document.getElementById("sunrise");
const citySunset = document.getElementById("sunset");
const weeklyForecast = document.getElementById("weeklyForecast");

function displayWeatherData(data) {
  let weatherCondition = data.weather[0].main;

  let categorizedWeather;
  let weatherIconPath;

  switch (weatherCondition) {
    case "Clear":
      categorizedWeather = "Sunny";
      weatherIconPath = "design/design2/icons/noun_Sunglasses_2055147.svg";
      cityName.textContent = `Get your sunnies on. ${data.name} is looking rather great today.`;
      break;
    case "Clouds":
      categorizedWeather = "Cloudy";
      weatherIconPath = "design/design2/icons/noun_Cloud_1188486.svg";
      cityName.textContent = `Light a fire and get cosy. ${data.name} is looking grey today.`;
      break;
    case "Rain":
    case "Drizzle":
      categorizedWeather = "Rainy";
      weatherIconPath = "design/design2/icons/noun_Umbrella_2030530.svg";
      cityName.textContent = `Don't forget your umbrella. It's wet in ${data.name} today.`;
      break;
    case "Snow":
      categorizedWeather = "Snowy";
      weatherIconPath = "design/design2/icons/Snow.svg";
      cityName.textContent = `Get warm clothes for these flakes outside.`;
      break;
    default:
      categorizedWeather = "Other";
      cityName.textContent = `${data.name} indicates ${weatherCondition} today.`;
  }

  document.body.setAttribute("data-weather", categorizedWeather);
  searchButton.setAttribute("data-weather", categorizedWeather);
  cityInput.setAttribute("data-weather", categorizedWeather);

  const sunriseTime = new Date(data.sys.sunrise * 1000);
  const sunsetTime = new Date(data.sys.sunset * 1000);
  citySunrise.textContent = `sunrise ${formatTime(sunriseTime)}`;
  citySunset.textContent = `sunset ${formatTime(sunsetTime)}`;
  temperature.textContent = `${data.weather[0].description} | ${(data.main.temp - 273.15).toFixed(1)}°C`;
  weatherIcon.innerHTML = `<img src="${weatherIconPath}" alt="Weather Icon">`;

  fetchWeeklyForecast(data.name);
}

function fetchWeatherByCoordinates(lat, lon) {
  fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      displayWeatherData(data);
    })
    .catch((error) => {
      console.error("Error fetching data based on coordinates:", error);
    });
}

function fetchWeeklyForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((forecastData) => {
      const dailyForecasts = forecastData.list.filter((item) => item.dt_txt.includes("12:00:00"));
      weeklyForecast.innerHTML = "";
      dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        const temp = (forecast.main.temp - 273.15).toFixed(1);
        const forecastItem = `<div class="forecast-item"><p>${day}</p><p>${temp}°</p></div>`;
        weeklyForecast.innerHTML += forecastItem;
      });
    })
    .catch((error) => {
      console.error("Error fetching weekly forecast data:", error);
    });
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeatherByCoordinates(lat, lon);
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition, () => {
    // Default city if geolocation fails...
    const defaultCity = "Göteborg";
    fetch(`${apiUrl}?q=${defaultCity}&appid=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        displayWeatherData(data);
      });
  });
} else {
  const defaultCity = "Göteborg";
  fetch(`${apiUrl}?q=${defaultCity}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      displayWeatherData(data);
    });
}

searchButton.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    fetchWeatherData(city);
  }
});

// Function to format time
function formatTime(date) {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "CET",
  };
  const formattedTime = new Intl.DateTimeFormat("default", options).format(date);
  return formattedTime.replace(":", ".");
}