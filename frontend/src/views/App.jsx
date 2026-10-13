import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  MapPin,
  RefreshCw,
  Search,
  Sun,
} from "lucide-react";
import { describeWeather, formatTemperature } from "../models/weather.js";
import { useWeatherViewModel } from "../viewmodels/useWeatherViewModel.js";

const weatherIcons = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

const dateFormatter = new Intl.DateTimeFormat("en-IL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Jerusalem",
});

const timeFormatter = new Intl.DateTimeFormat("en-IL", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Jerusalem",
});

function WeatherCard({ city }) {
  const condition = describeWeather(city.weather_symbol);
  const Icon = weatherIcons[condition.icon] ?? Cloud;

  return (
    <article className={`weather-card tone-${condition.tone}`}>
      <div className="card-heading">
        <div>
          <h2>{city.city}</h2>
          <p className="condition-label">{condition.label}</p>
        </div>
        <span className="weather-icon" aria-label={condition.label}>
          <Icon size={25} strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
      <div className="temperature-line" aria-label={`${formatTemperature(city.temperature_c)} degrees Celsius`}>
        <span className="temperature">{formatTemperature(city.temperature_c)}</span>
        <span className="unit">°C</span>
      </div>
      <div className="card-footer">
        <span>Fahrenheit</span>
        <strong>{formatTemperature(city.temperature_f)}°F</strong>
      </div>
    </article>
  );
}

function App() {
  const weather = useWeatherViewModel();

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Israel Weather home">
          <span className="brand-mark"><Sun size={19} strokeWidth={2} /></span>
          <span>field<span className="brand-dot">/</span>forecast</span>
        </a>
        <div className="topbar-location"><MapPin size={15} /> ISRAEL <span className="location-divider" /> LOCAL TIME</div>
      </header>

      <section className="intro" id="top">
        <div className="intro-copy">
          <p className="eyebrow"><span className="live-dot" /> LIVE CONDITIONS <span className="eyebrow-divider">/</span> {dateFormatter.format(new Date()).toUpperCase()}</p>
          <h1>Israel, <span>right now.</span></h1>
          <p className="intro-description">A clear view of the weather across the country.</p>
        </div>
        <div className="intro-meta">
          <span className="meta-label">LOCAL TIME</span>
          <strong>{timeFormatter.format(new Date())}</strong>
          <span className="meta-city">Asia/Jerusalem</span>
        </div>
      </section>

      <section className="weather-section" aria-labelledby="cities-heading">
        <div className="section-heading">
          <div className="section-title">
            <h2 id="cities-heading">City forecast</h2>
            <span className="city-count">{weather.totalCities ? String(weather.totalCities).padStart(2, "0") : "08"} CITIES</span>
          </div>
          <div className="toolbar">
            <label className="search-box">
              <Search size={17} aria-hidden="true" />
              <span className="visually-hidden">Search cities</span>
              <input
                type="search"
                placeholder="Find a city"
                value={weather.query}
                onChange={(event) => weather.setQuery(event.target.value)}
              />
            </label>
            <button className="refresh-button" onClick={weather.refresh} disabled={weather.isRefreshing} aria-label="Refresh weather" title="Refresh weather">
              <RefreshCw size={17} className={weather.isRefreshing ? "spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {weather.error && (
          <div className="status-message error-message" role="alert">
            <span>{weather.error}</span>
            <button onClick={weather.refresh}>Try again</button>
          </div>
        )}

        {weather.isLoading ? (
          <div className="weather-grid" aria-label="Loading city weather" aria-busy="true">
            {Array.from({ length: 8 }, (_, index) => <div className="weather-skeleton" key={index} />)}
          </div>
        ) : weather.cities.length > 0 ? (
          <div className="weather-grid" aria-live="polite">
            {weather.cities.map((city) => <WeatherCard city={city} key={city.city} />)}
          </div>
        ) : !weather.error ? (
          <div className="empty-state">No cities match “{weather.query}”.</div>
        ) : null}

        <footer className="section-footer">
          <span>Temperatures shown in Celsius and Fahrenheit</span>
          <span>{weather.updatedAt ? `Updated ${timeFormatter.format(weather.updatedAt)} local time` : "Weather updates every 10 minutes"}</span>
        </footer>
      </section>

      <footer className="page-footer">
        <span>WEATHER FOR EVERYWHERE YOU NEED TO BE.</span>
        <span>DATA BY MET NORWAY</span>
      </footer>
    </main>
  );
}

export default App;