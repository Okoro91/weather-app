import { format } from "date-fns";

export const formatTemperature = (temp, unit) => {
  const symbol = unit === "celsius" ? "°C" : "°F";
  return `${Math.round(temp)}${symbol}`;
};

export const formatWindSpeed = (speed, unit) => {
  return unit === "celsius" ? `${speed} km/h` : `${speed} mph`;
};

export const formatDistance = (distance, unit) => {
  return unit === "celsius" ? `${distance} km` : `${distance} miles`;
};

export const calculateDayLength = (sunrise, sunset) => {
  const sunriseDate = new Date(`1970-01-01T${sunrise}`);
  const sunsetDate = new Date(`1970-01-01T${sunset}`);

  const diff = sunsetDate - sunriseDate;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

export const formatDate = (date, formatStr = "PPP") => {
  return format(new Date(date), formatStr);
};

export const formatTime = (date, formatStr = "h:mm a") => {
  return format(new Date(date), formatStr);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// export const convertTemperature = (temp, from, to) => {
//   if (from === to) return temp;

//   if (from === "celsius" && to === "fahrenheit") {
//     return (temp * 9) / 5 + 32;
//   } else if (from === "fahrenheit" && to === "celsius") {
//     return ((temp - 32) * 5) / 9;
//   }

//   return temp;
// };

// export const getUVIndexInfo = (uvIndex) => {
//   if (uvIndex <= 2) return { color: "#10b981", description: "Low" };
//   if (uvIndex <= 5) return { color: "#f59e0b", description: "Moderate" };
//   if (uvIndex <= 7) return { color: "#f97316", description: "High" };
//   if (uvIndex <= 10) return { color: "#ef4444", description: "Very High" };
//   return { color: "#7c2d12", description: "Extreme" };
// };
