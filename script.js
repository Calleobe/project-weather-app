const apiKey = "8b5546cda6f5f19b75c0a17daab06b19";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const searchForm = document.getElementById("searchForm");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const citySunrise = document.getElementById("sunrise");
const citySunset = document.getElementById("sunset");
const weeklyForecast = document.getElementById("weeklyForecast");

// Function to fetch weather data and update the UI
function fetchWeatherData(city) {
  fetch(`${apiUrl}?q=${city}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      const weatherCondition = data.weather[0].main;
      updateUI(weatherCondition, data);
      clearError(); // Clear the error message
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      displayError("City not found, maybe a typo? Try again."); // Display an error message
    });
}

// Function to display an error message, if the city is not present:
function displayError(message) {
  const errorElement = document.getElementById("error");
  errorElement.textContent = message;
}

// Function to clear the error message
function clearError() {
  const errorElement = document.getElementById("error");
  errorElement.textContent = "";
}

// Function to update the UI based on weather condition
function updateUI(weatherCondition, data) {
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

  // Fetch and display the weekly forecast
  fetchWeeklyForecast(data.name);
}

// Function to fetch and display the weekly forecast
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

// Event listener for the form submission
searchForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent the default form submission
  const city = cityInput.value;
  if (city) {
    fetchWeatherData(city);
  }
});

// Event listener for the search button
searchButton.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    fetchWeatherData(city);
  }
});

//Start with Stockholm data: 
fetchWeatherData("Stockholm");
