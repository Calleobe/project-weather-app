const apiKey = "8b5546cda6f5f19b75c0a17daab06b19";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const citySunrise = document.getElementById("sunrise");
const citySunset = document.getElementById("sunset");
//Extra data:
const toggleButton = document.getElementById("toggleHumidityWind");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const weeklyForecast = document.getElementById("weeklyForecast");

// Define a variable to track whether geolocation has been used.
let geolocationUsed = false;

// Default city (initially set based on geolocation)
let defaultCity = "Göteborg";

function displayWeatherData(data) {
  let weatherCondition = data.weather[0].main;

  let categorizedWeather;
  let weatherIconPath;

  switch (weatherCondition) {
    case "Clear":
      categorizedWeather = "Sunny";
      weatherIconPath = "design/design2/icons/noun_Sunglasses_2055147.svg";
      cityName.textContent = `Get your sunnies on. ${data.name} is looking rather great today.`;
      weatherIcon.innerHTML = `
      <div class="scene">
     
      <div class="sun-container">
      <div class="sun"></div>
          <div class="beam beam1"></div>
          <div class="beam beam2"></div>
          <div class="beam beam3"></div>
          <div class="beam beam4"></div>
          <div class="beam beam5"></div>
          <div class="beam beam6"></div>
          <div class="beam beam7"></div>
          <div class="beam beam8"></div>
      </div>
  </div>
  <img src="${weatherIconPath}" alt="Weather Icon">
      `;
      break;
    case "Clouds":
      categorizedWeather = "Cloudy";
      weatherIconPath = "design/design2/icons/Cloud2.svg";
      cityName.textContent = `Light a fire and get cosy. ${data.name} is looking grey today.`;
      weatherIcon.innerHTML = `<div class="cloud-container">
      <img src="${weatherIconPath}" alt="Cloud" class="moving-cloud cloud1">
      <img src="${weatherIconPath}" alt="Cloud" class="moving-cloud cloud2">
      <img src="${weatherIconPath}" alt="Cloud" class="moving-cloud cloud3">
      <img src="${weatherIconPath}" alt="Cloud" class="moving-cloud cloud4">
      <img src="${weatherIconPath}" alt="Cloud" class="moving-cloud cloud5">
  </div>`;
      break;
    case "Rain":
    case "Drizzle":
      categorizedWeather = "Rainy";
      weatherIconPath = "design/design2/icons/noun_Umbrella_2030530.svg";
      cityName.textContent = `Don't forget your umbrella. \nIt's wet in ${data.name} today.`;
      weatherIcon.innerHTML = `<div class="rain-container">
      <img src="${weatherIconPath}" alt="Weather Icon">
      <img src="design/design2/icons/raindrop.svg" alt="Raindrop" class="raindrop drop1">
      <img src="design/design2/icons/raindrop.svg" class="raindrop drop2">
      <img src="design/design2/icons/raindrop.svg" class="raindrop drop3">
      <img src="design/design2/icons/raindrop.svg" class="raindrop drop4">
      <img src="design/design2/icons/raindrop.svg" class="raindrop drop5">

  </div>`;

      break;
    case "Snow":
      categorizedWeather = "Snowy";
      weatherIconPath = "design/design2/icons/Snow.svg";
      cityName.textContent = `Get warm clothes for these flakes outside.`;
      weatherIcon.innerHTML = `<img src="${weatherIconPath}" alt="Weather Icon">`;
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
  //EXTRA, More data to be shown for each city:
  //WindSpeed -- extra:
  windSpeed.textContent = `wind speed: ${data.wind.speed} m/s`;
  //Humidity -- extra:
  humidity.textContent = `humidity: ${data.main.humidity}%`;
  temperature.textContent = `${data.weather[0].description} | ${(
    data.main.temp - 273.15
  ).toFixed(1)}°C`;
  //weatherIcon.innerHTML = `<img src="${weatherIconPath}" alt="Weather Icon">`;

  fetchWeeklyForecast(data.name);
  console.log("Full API Response:", data);
}

//EXTRA: toggle for extra:
let isHumidityWindVisible = false;

toggleButton.addEventListener("click", () => {
  isHumidityWindVisible = !isHumidityWindVisible;

  if (isHumidityWindVisible) {
    humidity.style.display = "block";
    windSpeed.style.display = "block";
    toggleButton.textContent = "Hide extra info";
  } else {
    humidity.style.display = "none";
    windSpeed.style.display = "none";
    toggleButton.textContent = "Show extra info";
  }
});

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
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((forecastData) => {
      const dailyForecasts = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
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
  navigator.geolocation.getCurrentPosition((position) => {
    if (!geolocationUsed) {
      geolocationUsed = true;
      // Set the default city based on geolocation only if it hasn't been used before.
      defaultCity = "";
      showPosition(position);
    }
  });
} else {
  // If geolocation is not available, set the default city to the fallback value.
  defaultCity = "Göteborg";
  fetchWeatherData(defaultCity);
}

searchButton.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    // Update the default city with the user's input.
    defaultCity = city;
    fetchWeatherData(city);
  }
});

// Function to fetch and display weather data for the default city
function fetchWeatherData(city) {
  fetch(`${apiUrl}?q=${city}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        // Valid weather data
        displayWeatherData(data);
        document.getElementById("error").textContent = ""; // Clear any previous error message
      } else {
        // Invalid input, show error message
        document.getElementById("error").textContent =
          "Invalid city or location.";
      }
    })
    .catch((error) => {
      console.error("Error fetching current weather data:", error);
      document.getElementById("error").textContent =
        "An error occurred while fetching data.";
    });
}

// Function to format time
function formatTime(date) {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "CET",
  };
  const formattedTime = new Intl.DateTimeFormat("default", options).format(
    date
  );
  return formattedTime.replace(":", ".");
}

// Prevent the form from submitting
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("cityInput").value;
  if (city) {
    // Update the default city with the user's input.
    defaultCity = city;
    fetchWeatherData(city);
  }
});

// Set the default city to "Göteborg" on page load
fetchWeatherData(defaultCity);
