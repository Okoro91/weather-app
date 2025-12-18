import "./styles/style.css";
import initializeApp from "./modules/ui.js";
import {
  initializeEventListeners,
  updateWeatherDisplay,
} from "./modules/dom.js";
import {
  loadSettings,
  saveRecentSearch,
  saveSettings,
} from "./modules/storage.js";
import { fetchWeatherData, fetchGif } from "./modules/api.js";

const state = {
  currentWeather: null,
  forecast: null,
  unit: "celsius",
  location: null,
  isLoading: false,
  error: null,
};

const init = async () => {
  try {
    console.log("🌤️ miCast Weather App Initializing...");

    const settings = loadSettings();
    state.unit = settings.unit || "celsius";
    state.theme = settings.theme || "light";

    initializeApp(state);

    initializeEventListeners(state, {
      onSearch: (location) => handleWeatherUpdate(location),
      onLocationRequest: () => getGeolocation(),
      onUnitChange: (newUnit) => {
        state.unit = newUnit;
        saveSettings({ unit: newUnit });
        if (state.location) handleWeatherUpdate(state.location.name);
      },
    });

    if (state.theme === "dark") {
      document.body.classList.add("dark-theme");
    }

    const initialLocation = settings.lastLocation || "Lagos, Nigeria";
    await handleWeatherUpdate(initialLocation);

    console.log("✅ App initialized successfully");
  } catch (error) {
    console.error("Error initializing app:", error);
    showError("Failed to initialize application. Please refresh.");
  }
};

const handleWeatherUpdate = async (locationQuery) => {
  if (!locationQuery) return;

  state.isLoading = true;
  toggleLoading(true);

  try {
    const weatherData = await fetchWeatherData(locationQuery, state.unit);

    const gifUrl = await fetchGif(weatherData.current.condition);

    state.currentWeather = weatherData.current;
    state.location = weatherData.location;

    updateWeatherDisplay(weatherData, gifUrl);

    saveRecentSearch(weatherData.location);
    saveSettings({ lastLocation: weatherData.location.name });
  } catch (error) {
    console.error("Weather Update Failed:", error);
    showError(error.message);
  } finally {
    state.isLoading = false;
    toggleLoading(false);
  }
};

const getGeolocation = () => {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser");
    return;
  }

  toggleLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      await handleWeatherUpdate({ latitude, longitude });
    },
    (error) => {
      toggleLoading(false);
      const msg =
        error.code === 1 ? "Location access denied" : "Location error";
      showError(msg);
    }
  );
};

const toggleLoading = (show) => {
  const loader = document.getElementById("loading-overlay");
  if (!loader) return;
  show ? loader.classList.remove("hidden") : loader.classList.add("hidden");
};

const showError = (message) => {
  const errorModal = document.getElementById("error-modal");
  if (errorModal) {
    document.getElementById("error-message").textContent = message;
    errorModal.classList.remove("hidden");
  } else {
    alert(`Error: ${message}`);
  }
};

document.addEventListener("DOMContentLoaded", init);
