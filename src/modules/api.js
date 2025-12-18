const API_CONFIG = {
  visualCrossing: {
    baseUrl:
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline",
    apiKey: process.env.VC_API_KEY,
    defaultLocation: "Lagos, Nigeria",
  },
  giphy: {
    baseUrl: "https://api.giphy.com/v1/gifs/translate",
    apiKey: process.env.GIPHY_API_KEY,
  },
};

console.log("API Config:", API_CONFIG);

const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const fetchWeatherData = async (
  location = API_CONFIG.visualCrossing.defaultLocation,
  unit = "celsius"
) => {
  const cacheKey = `${location}-${unit}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const unitGroup = unit === "celsius" ? "metric" : "us";

  let locationQuery;

  if (typeof location === "string") {
    locationQuery = location.trim();
  } else if (
    typeof location === "object" &&
    location.latitude &&
    location.longitude
  ) {
    locationQuery = `${location.latitude},${location.longitude}`;
  } else {
    locationQuery = API_CONFIG.visualCrossing.defaultLocation;
  }

  const safeLocation = encodeURIComponent(locationQuery);

  const url = `${API_CONFIG.visualCrossing.baseUrl}/${safeLocation}?key=${
    API_CONFIG.visualCrossing.apiKey
  }&unitGroup=${unitGroup}&include=current,hours,days&contentType=json`;

  try {
    const res = await fetch(url);

    console.log("Weather API response status:", res.status, res);

    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status}`);
    }

    const rawData = await res.json();
    console.log("Raw weather data:", rawData);
    const processedData = processWeatherData(rawData, location, unit);
    console.log("Processed weather data:", processedData);

    cache.set(cacheKey, {
      data: processedData,
      timestamp: Date.now(),
    });

    return processedData;
  } catch (error) {
    console.error("Weather fetch failed:", error);
    throw new Error(`Failed to fetch weather: ${error.message}`);
  }
};

const processWeatherData = (data, location, unit) => {
  if (!data?.currentConditions || !data?.days) {
    throw new Error("Invalid weather data structure");
  }

  const current = {
    temp: Math.round(data.currentConditions.temp),
    feelsLike: Math.round(data.currentConditions.feelslike),
    condition: data.currentConditions.conditions,
    icon: data.currentConditions.icon,
    humidity: data.currentConditions.humidity,
    windSpeed: Math.round(data.currentConditions.windspeed),
    windDirection: data.currentConditions.winddir,
    pressure: data.currentConditions.pressure,
    uvIndex: data.currentConditions.uvindex,
    visibility: data.currentConditions.visibility,
    sunrise: data.currentConditions.sunrise,
    sunset: data.currentConditions.sunset,
    windDirection: data.currentConditions.winddir,
    moonPhase: data.currentConditions.moonphase, // Returns 0-1
  };

  const forecast = data.days.slice(0, 7).map((day) => ({
    date: new Date(day.datetime),
    high: Math.round(day.tempmax),
    low: Math.round(day.tempmin),
    condition: day.conditions,
    icon: day.icon,
    precipitation: day.precipprob,
    sunrise: day.sunrise,
    sunset: day.sunset,
  }));

  const hourly = data.days[0].hours.slice(0, 24).map((hour) => ({
    time: hour.datetime,
    temp: Math.round(hour.temp),
    condition: hour.conditions,
    icon: hour.icon,
    precipitation: hour.precipprob,
  }));

  return {
    location: {
      name: data.resolvedAddress || location,
      latitude: data.latitude,
      longitude: data.longitude,
    },
    current,
    forecast,
    hourly,
    unit,
    lastUpdated: new Date(),
  };
};

export const fetchGif = async (weatherCondition) => {
  const cacheKey = `gif-${weatherCondition}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const searchTerms = {
    clear: "sunny weather",
    "partly-cloudy": "partly cloudy sky",
    cloudy: "cloudy weather",
    rain: "rain weather",
    snow: "snow weather",
    thunderstorm: "thunderstorm lightning",
    fog: "fog mist",
    wind: "windy weather",
  };

  const term = searchTerms[weatherCondition?.toLowerCase()] || weatherCondition;

  const url = `${API_CONFIG.giphy.baseUrl}?api_key=${
    API_CONFIG.giphy.apiKey
  }&s=${encodeURIComponent(term + " weather")}&rating=g`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Giphy API error: ${response.status}`);
    }

    const data = await response.json();
    const gifUrl = data.data?.images?.original?.url;

    cache.set(cacheKey, {
      data: gifUrl,
      timestamp: Date.now(),
    });

    return gifUrl;
  } catch (error) {
    console.error("GIF fetch failed:", error);
    return getWeatherGradient(weatherCondition);
  }
};

const getWeatherGradient = (condition = "clear") => {
  const gradients = {
    clear: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "partly-cloudy": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    cloudy: "linear-gradient(135deg, #a3bded 0%, #6991c7 100%)",
    rain: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
    snow: "linear-gradient(135deg, #e6dada 0%, #274046 100%)",
    thunderstorm:
      "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    fog: "linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)",
  };

  return gradients[condition.toLowerCase()] || gradients.clear;
};

const icons = require.context("../assets/icons", true, /\.svg$/);

export function getWeatherIcon(iconName, isDay = true) {
  try {
    // const timeOfDay = isDay ? "day" : "night";
    const timeOfDay = "day" || "night";

    const iconMap = {
      "clear-day": "clear.svg",
      "clear-night": "clear.svg",
      "partly-cloudy-day": "partly-cloudy-day.svg",
      "partly-cloudy-night": "partly-cloudy-night.svg",
      cloudy: "cloudy.svg",
      rain: "rain.svg",
      snow: "snow.svg",
      fog: "fog.svg",
      wind: "wind.svg",
      thunderstorm: "thunderstorm.svg",
    };

    console.log("Loading icon:", iconName, "as", timeOfDay);

    const fileName = iconMap[iconName] || "clear.svg";
    console.log("icons:", icons);
    console.log(
      "Resolved icon file name:",
      icons(`./${timeOfDay}/${fileName}`)
    );
    return icons(`./${timeOfDay}/${fileName}`);
  } catch (error) {
    console.error("Icon load failed:", error);
    return null;
  }
}

export const searchLocations = async (query) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return (
      data.results?.map((item) => ({
        name: item.name,
        country: item.country,
        latitude: item.latitude,
        longitude: item.longitude,
        displayName: `${item.name}, ${item.country}`,
      })) || []
    );
  } catch (error) {
    console.error("Location search failed:", error);
    return [];
  }
};
