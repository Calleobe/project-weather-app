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
  if (weatherCondition === "Clear") {
    categorizedWeather = "Sunny";
    weatherIcon.innerHTML = `<img src="design/design2/icons/noun_Sunglasses_2055147.svg" alt="Weather Icon">`;
    cityName.textContent = `Get your sunnies on. \n${data.name} is looking rather great today.`;
  } else if (weatherCondition === "Clouds") {
    categorizedWeather = "Cloudy";
    weatherIcon.innerHTML = `<img src="design/design2/icons/noun_Cloud_1188486.svg" alt="Weather Icon">`;
    cityName.textContent = `Light a fire and get cosy. \n${data.name} is looking grey today.`;
  } else if (["Rain", "Drizzle"].includes(weatherCondition)) {
    categorizedWeather = "Rainy";
    weatherIcon.innerHTML = `<img src="design/design2/icons/noun_Umbrella_2030530.svg" alt="Weather Icon">`;
    cityName.textContent = `Don't forget your umbrella. \nIt's wet in ${data.name} today.`;
  } else {
    categorizedWeather = "Other";
    cityName.textContent = ` ${data.name} indicates ${weatherCondition} today.`;
  }
  document.body.setAttribute("data-weather", categorizedWeather);

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
  const sunriseTime = new Date(data.sys.sunrise * 1000);
  const sunsetTime = new Date(data.sys.sunset * 1000);
  const formattedSunrise = formatTime(sunriseTime);
  const formattedSunset = formatTime(sunsetTime);

  citySunrise.textContent = `sunrise ${formattedSunrise}`;
  citySunset.textContent = `sunset ${formattedSunset}`;
  temperature.textContent = `${data.weather[0].description} | ${(
    data.main.temp - 273.15
  ).toFixed(1)}°C`;
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

function fetchWeeklyForecast(city = null, lat = null, lon = null) {
  let forecastUrl = city
    ? `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    : `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((forecastData) => {
      const dailyForecasts = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      weeklyForecast.innerHTML = "";
      dailyForecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const icon = forecast.weather[0].icon;
        const temp = (forecast.main.temp - 273.15).toFixed(1);
        const description = forecast.weather[0].description;
        const forecastItem = `
                    <div class="forecast-item">
                        <p>${day}</p>
                        <p>${temp}°</p>
                    </div>
                `;
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
  fetchWeeklyForecast(null, lat, lon); //Fetch the weekly forecast using the coordinats.
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
    fetchWeeklyForecast(defaultCity);
  });
} else {
  const defaultCity = "Göteborg";
  fetch(`${apiUrl}?q=${defaultCity}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      displayWeatherData(data);
    });
  fetchWeeklyForecast(defaultCity);
}

searchButton.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    fetch(`${apiUrl}?q=${city}&appid=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        displayWeatherData(data);
        fetchWeeklyForecast(city); // Fetch the weekly forecast using city.
      })
      .catch((error) => {
        console.error("Error fetching current weather data:", error);
      });
  }
});
