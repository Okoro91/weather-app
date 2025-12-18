const STORAGE_KEYS = {
  PREFERENCES: "weatherPreferences",
  RECENT_SEARCHES: "recentSearches",
  FAVORITES: "favoriteLocations",
  SETTINGS: "appSettings",
};

const DEFAULT_SETTINGS = {
  theme: "light",
  animations: true,
  notifications: false,
  defaultView: "current",
  refreshInterval: 10,
  unit: "celsius",
};

const getFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

export const loadSettings = () =>
  getFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

export const getRecentSearches = () =>
  getFromStorage(STORAGE_KEYS.RECENT_SEARCHES, []);

export const getFavorites = () => getFromStorage(STORAGE_KEYS.FAVORITES, []);

export const saveRecentSearch = (location) => {
  if (!location?.displayName) return;

  try {
    const searches = getRecentSearches();
    const filtered = searches.filter(
      (s) => s.displayName !== location.displayName
    );

    filtered.unshift({ ...location, timestamp: Date.now() });
    localStorage.setItem(
      STORAGE_KEYS.RECENT_SEARCHES,
      JSON.stringify(filtered.slice(0, 5))
    );
  } catch (error) {
    console.error("Error saving recent search:", error);
  }
};

export const toggleFavorite = (location) => {
  try {
    const favorites = getFavorites();
    const index = favorites.findIndex(
      (f) => f.displayName === location.displayName
    );

    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      return false;
    } else {
      favorites.push({ ...location, addedAt: Date.now() });
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      return true;
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
};

export const saveSettings = (settings) => {
  try {
    const currentSettings = loadSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};
