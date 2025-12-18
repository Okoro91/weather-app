import sun from "../assets/icons/day/clear.svg";
console.log(sun);

const initializeApp = (state) => {
  const content = document.getElementById("content");

  content.innerHTML = `
      <div class="app-container">
        
        <header class="app-header">
          <div class="header-left">
            <h1 class="app-title">
              <span class="weather-icon">
                <img src="${sun}" alt="Sun Icon" class="icon-img" />
              </span>
              miCast
            </h1>
            <p class="app-subtitle">World-Class Weather Intelligence</p>
          </div>
          
          <div class="header-right">
            <button id="theme-toggle" class="btn-icon" title="Toggle theme">
              🌙
            </button>
            <div class="header-controls">
              <button id="location-btn" class="btn-icon" title="Use my location">
                📍
              </button>
              <button id="unit-toggle" class="btn-unit" data-unit="${state.unit}">
                ${state.unit === "celsius" ? "°F" : "°C"}
              </button>
            </div>
          </div>
        </header>
  
        
        <section class="search-section">
          <div class="search-container">
            <form id="search-form" class="search-form">
              <div class="search-input-wrapper">
                <input 
                  type="text" 
                  id="search-input"
                  class="search-input"
                  placeholder="Search city, zip code, or airport..."
                  autocomplete="off"
                >
                <button type="submit" id="search-btn" class="search-btn">
                  <span class="search-icon">🔍</span>
                  Search
                </button>
              </div>
              <div class="search-suggestions" id="search-suggestions"></div>
            </form>
            <div class="search-tips">
              <span class="tip">Try: "Lagos", "Abuja", "Kano, NG"</span>
            </div>
          </div>
        </section>
  
      
        <main class="weather-main" id="weather-container">
          <!-- Alerts will be inserted here -->
          
         
          <section class="current-weather">
            <div class="current-header">
              <h2 class="current-location" id="current-location">
                ${state.location || "Search for a location"}
              </h2>
              <div class="last-updated" id="last-updated">
                ${state.currentWeather ? "Updated recently" : ""}
              </div>
            </div>
            
            <div class="current-body">
              <div class="current-primary">
                <div class="temp-display">
                  <div class="temp-value" id="current-temp">
                    ${state.currentWeather ? `${state.currentWeather.temp}°` : "--"}
                  </div>
                  <div class="temp-details">
                    <div class="condition" id="current-condition">
                      ${state.currentWeather?.condition || "Clear"}
                    </div>
                    <div class="feels-like">
                      Feels like <span id="feels-like">${state.currentWeather?.feelsLike || "--"}°</span>
                    </div>
                  </div>
                </div>
                <div class="weather-icon-large" id="current-icon">
                </div>
              </div>
              
              <div class="current-secondary">
                <div class="weather-grid">
                  <div class="weather-item">
                    <div class="weather-label">Humidity</div>
                    <div class="weather-value" id="humidity">${state.currentWeather?.humidity || "--"}%</div>
                  </div>
                  <div class="weather-item">
                    <div class="weather-label">Wind</div>
                    <div class="weather-value" id="wind-speed">${state.currentWeather?.windSpeed || "--"} km/h</div>
                  </div>
                  <div class="weather-item">
                    <div class="weather-label">Pressure</div>
                    <div class="weather-value" id="pressure">${state.currentWeather?.pressure || "--"} hPa</div>
                  </div>
                  <div class="weather-item">
                    <div class="weather-label">UV Index</div>
                    <div class="weather-value" id="uv-index">${state.currentWeather?.uvIndex || "--"}</div>
                  </div>
                  <div class="weather-item">
                    <div class="weather-label">Visibility</div>
                    <div class="weather-value" id="visibility">${state.currentWeather?.visibility || "--"} km</div>
                  </div>
                  <div class="weather-item">
                    <div class="weather-label">Sunrise</div>
                    <div class="weather-value" id="sunrise">${state.currentWeather?.sunrise || "--"}</div>
                  </div>
                  <div class="weather-item">
                    <div class="weather-label">Sunset</div>
                    <div class="weather-value" id="sunset">${state.currentWeather?.sunset || "--"}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
         
          <section class="hourly-forecast">
            <h3 class="section-title">24-Hour Forecast</h3>
            <div class="hourly-scroll" id="hourly-forecast">
              <div class="hourly-placeholder">
                <p>Hourly forecast will appear here</p>
              </div>
            </div>
          </section>
  
          
          <section class="daily-forecast">
            <h3 class="section-title">7-Day Forecast</h3>
            <div class="daily-grid" id="daily-forecast">
              
              <div class="daily-placeholder">
                <p>7-day forecast will appear here</p>
              </div>
            </div>
          </section>
  
          

          <section class="additional-info">
  <div class="info-grid">
  

    <div class="info-card">
      <h4>💨 Wind Details</h4>
      <p class="info-value" id="wind-direction">${state.currentWeather?.windDirection || "--"}</p>
      <p class="info-desc">Direction</p>
    </div>
    <div class="info-card">
      <h4>🌅 Day Length</h4>
      <p class="info-value" id="day-length">--</p>
      <p class="info-desc">Sunrise to Sunset</p>
    </div>
    <div class="info-card">
      <h4>📈 Moon Phase</h4>
      <p class="info-value" id="moon-phase"></p>
    </div>
  </div>
</section>
        </main>
  
        
        <footer class="app-footer">
          <div class="footer-content">
            <div class="footer-left">
              <p>Powered by Visual Crossing Weather API & Giphy</p>
              <p class="footer-note">Data updates every 10 minutes</p>
              <p>
              design & code by:
              <a href="https://okoro91.github.io/portfolio/">mi okoro</a>
            </p>
            </div>
            <div class="footer-right">
              <button class="btn-text" id="refresh-btn">
                🔄 Refresh
              </button>
              <button class="btn-text" id="settings-btn">
                ⚙️ Settings
              </button>
            </div>
          </div>
        </footer>
      </div>
    `;
};

export default initializeApp;
