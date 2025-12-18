import moon from "../assets/unit/night.svg";
import sun from "../assets/unit/day.svg";

import { getWeatherIcon } from "./api.js";
import {
  formatTemperature,
  formatWindSpeed,
  formatDistance,
  formatTime,
  calculateDayLength,
  debounce,
} from "./utils.js";
import { format } from "date-fns";

const elements = {};

/**
 * @param {Object} state - Global App State
 * @param {Object} callbacks - Functions from index.js (e.g., fetchWeather, getGeolocation)
 */
export const initializeEventListeners = (state, callbacks) => {
  cacheElements();
  setupEventListeners(state, callbacks);
};

const cacheElements = () => {
  elements.app = document.getElementById("content");
  elements.searchInput = document.querySelector("#search-input");
  elements.searchBtn = document.querySelector("#search-btn");
  elements.locationBtn = document.querySelector("#location-btn");
  elements.unitToggle = document.querySelector("#unit-toggle");
  elements.weatherContainer = document.querySelector("#weather-container");
  elements.currentTemp = document.querySelector("#current-temp");
  elements.currentCondition = document.querySelector("#current-condition");
  elements.currentLocation = document.querySelector("#current-location");
  elements.currentIcon = document.querySelector("#current-icon");
  elements.feelsLike = document.querySelector("#feels-like");
  elements.humidity = document.querySelector("#humidity");
  elements.windSpeed = document.querySelector("#wind-speed");
  elements.pressure = document.querySelector("#pressure");
  elements.uvIndex = document.querySelector("#uv-index");
  elements.visibility = document.querySelector("#visibility");
  elements.sunrise = document.querySelector("#sunrise");
  elements.sunset = document.querySelector("#sunset");
  elements.hourlyForecast = document.querySelector("#hourly-forecast");
  elements.dailyForecast = document.querySelector("#daily-forecast");
  elements.themeToggle = document.querySelector("#theme-toggle");
  elements.dayLength = document.querySelector("#day-length");
  elements.windDirection = document.querySelector("#wind-direction");
  elements.moonPhase = document.querySelector("#moon-phase");
  elements.moonIllumination = document.querySelector("#moon-illumination");
  elements.cloudCover = document.querySelector("#cloud-cover-value");
};

const setupEventListeners = (state, callbacks) => {
  const { onSearch, onLocationRequest, onUnitChange } = callbacks;

  elements.searchBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const loc = elements.searchInput.value.trim();
    if (loc) onSearch(loc);
  });

  elements.searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const loc = elements.searchInput.value.trim();
      if (loc) onSearch(loc);
    }
  });

  elements.locationBtn?.addEventListener("click", onLocationRequest);

  elements.unitToggle?.addEventListener("click", () => {
    state.unit = state.unit === "celsius" ? "fahrenheit" : "celsius";
    updateUnitToggle(state.unit);
    onUnitChange(state.unit);
  });

  elements.themeToggle?.addEventListener("click", toggleTheme);

  elements.searchInput?.addEventListener(
    "input",
    debounce((e) => showSearchSuggestions(e.target.value), 300)
  );
};

export const updateWeatherDisplay = (weatherData, backgroundUrl) => {
  if (!weatherData) return;
  updateBackground(backgroundUrl, weatherData.current.condition);
  updateCurrentWeather(weatherData);
  updateHourlyForecast(
    weatherData.hourly,
    weatherData.current.sunrise,
    weatherData.current.sunset
  );
  updateDailyForecast(weatherData.forecast);
  if (weatherData.alerts?.length > 0) showAlerts(weatherData.alerts);
  updateLastUpdated(weatherData.lastUpdated);
};

const updateCurrentWeather = async (data) => {
  const { current, location, unit } = data;

  const isDay = isCurrentlyDay(current.sunrise, current.sunset);

  elements.currentLocation.textContent = location.name;
  elements.currentTemp.innerHTML = formatTemperature(current.temp, unit);
  elements.currentCondition.textContent = current.condition;

  elements.feelsLike.textContent = formatTemperature(current.feelsLike, unit);
  elements.humidity.textContent = `${current.humidity}%`;
  elements.windSpeed.textContent = formatWindSpeed(current.windSpeed, unit);
  elements.pressure.textContent = `${current.pressure} hPa`;
  elements.uvIndex.textContent = current.uvIndex;
  elements.visibility.textContent = formatDistance(current.visibility, unit);
  elements.sunrise.textContent = formatTime(`1970-01-01T${current.sunrise}`);
  elements.sunset.textContent = formatTime(`1970-01-01T${current.sunset}`);

  if (elements.dayLength) {
    elements.dayLength.textContent = calculateDayLength(
      current.sunrise,
      current.sunset
    );
  }

  const iconPath = await getWeatherIcon(current.icon, isDay);

  if (iconPath) {
    elements.currentIcon.innerHTML = `<img src="${iconPath}" alt="${current.condition}" class="weather-icon-main" />`;
  } else {
    elements.currentIcon.innerHTML = "";
  }

  if (elements.windDirection) {
    elements.windDirection.textContent = `${current.windDirection}°`;
  }

  if (elements.dayLength) {
    elements.dayLength.textContent = calculateDayLength(
      current.sunrise,
      current.sunset
    );
  }

  if (elements.moonPhase) {
    const phase = current.moonPhase;
    let phaseName = "Unknown";
    if (phase === 0 || phase === 1) phaseName = "New Moon";
    else if (phase > 0 && phase < 0.25) phaseName = "Waxing Crescent";
    else if (phase === 0.25) phaseName = "First Quarter";
    else if (phase > 0.25 && phase < 0.5) phaseName = "Waxing Gibbous";
    else if (phase === 0.5) phaseName = "Full Moon";
    else if (phase > 0.5 && phase < 0.75) phaseName = "Waning Gibbous";
    else if (phase === 0.75) phaseName = "Last Quarter";
    else if (phase > 0.75 && phase < 1) phaseName = "Waning Crescent";

    elements.moonPhase.textContent = phaseName;
  }
};

const updateBackground = (url, condition) => {
  const app = elements.app;
  if (!app) return;

  app.style.backgroundImage = url.startsWith("http") ? `url('${url}')` : url;
  app.style.backgroundSize = "cover";
  app.style.backgroundPosition = "center";

  if (!app.querySelector(".bg-overlay")) {
    const overlay = document.createElement("div");
    overlay.className = "bg-overlay";
    app.insertBefore(overlay, app.firstChild);
  }
};

export const updateHourlyForecast = async (hourlyData, sunrise, sunset) => {
  elements.hourlyForecast.innerHTML = "";

  for (const hour of hourlyData.slice(0, 24)) {
    const hourEl = document.createElement("div");
    hourEl.className = "hour-item";

    const isDay = hour.time >= sunrise && hour.time <= sunset;

    const iconPath = await getWeatherIcon(hour.icon, isDay);
    console.log("Hour Icon Path:", hour.icon);

    const time = format(new Date(`1970-01-01T${hour.time}`), "ha");

    hourEl.innerHTML = `
      <div class="hour-time">${time}</div>
      <div class="hour-icon-wrapper">
        <img src="${iconPath}" alt="${hour.icon}" class="hourly-icon-img" />
      </div>
      <div class="hour-temp">${Math.round(hour.temp)}°</div>
      <div class="hour-precip">
        ${hour.precipitation > 0 ? `${hour.precipitation}%` : ""}
      </div>
    `;

    elements.hourlyForecast.appendChild(hourEl);
  }
};

const updateDailyForecast = (dailyData) => {
  elements.dailyForecast.innerHTML = "";
  dailyData.forEach((day) => {
    const dayEl = document.createElement("div");
    dayEl.className = "day-item";
    const date = format(new Date(day.date), "EEE");
    dayEl.innerHTML = `
      <div class="day-name">${date}</div>
      <div class="day-icon">${day.icon}</div>
      <div class="day-temps">
        <span class="day-high">${day.high}°</span>
        <span class="day-low">${day.low}°</span>
      </div>
      <div class="day-precip"><i>💧</i> ${day.precipitation}%</div>
    `;
    elements.dailyForecast.appendChild(dayEl);
  });
};

const isCurrentlyDay = (sunrise, sunset) => {
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  const sunriseTime = new Date(`${todayStr}T${sunrise}`);
  const sunsetTime = new Date(`${todayStr}T${sunset}`);
  return now >= sunriseTime && now <= sunsetTime;
};

const updateUnitToggle = (unit) => {
  elements.unitToggle.textContent = unit === "celsius" ? "°F" : "°C";
};

const toggleTheme = () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  elements.themeToggle.innerHTML = isDark
    ? `<img src="${moon}" alt="Moon Icon" class="small-icon" />`
    : `<img src="${sun}" alt="Sun Icon" class="small-icon" />`;
};

const showSearchSuggestions = async (query) => {
  if (query.length < 2) return;
  const { searchLocations } = await import("./api.js");
  const suggestions = await searchLocations(query);
  console.log("Suggestions:", suggestions);
};

const updateLastUpdated = (timestamp) => {
  const now = new Date();
  const diff = Math.floor((now - timestamp) / 60000);

  let timeText;
  if (diff < 1) timeText = "Just now";
  else if (diff === 1) timeText = "1 minute ago";
  else if (diff < 60) timeText = `${diff} minutes ago`;
  else if (diff < 120) timeText = "1 hour ago";
  else timeText = `${Math.floor(diff / 60)} hours ago`;

  const lastUpdatedEl = document.querySelector("#last-updated");
  if (lastUpdatedEl) {
    lastUpdatedEl.textContent = `Updated ${timeText}`;
  }
};
