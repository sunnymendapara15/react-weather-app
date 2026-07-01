import { useEffect, useMemo, useState } from 'react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim();
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

const formatTime = (dt, options) =>
  new Date(dt * 1000).toLocaleTimeString(undefined, options);

const formatDate = (dt) =>
  new Date(dt * 1000).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

function App() {
  const [city, setCity] = useState('San Francisco');
  const [input, setInput] = useState('San Francisco');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const greeting = useMemo(() => {
    if (!weather) return 'Search for a city above.';
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${weather.name}!`;
    if (hour < 18) return `Good afternoon, ${weather.name}!`;
    return `Good evening, ${weather.name}!`;
  }, [weather]);

  const fetchWeather = async (targetCity) => {
    if (!targetCity?.trim()) return;
    if (!API_KEY) {
      setError('API key is missing. Add it to your .env file and restart the dev server.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${WEATHER_URL}?q=${encodeURIComponent(targetCity)}&units=metric&appid=${API_KEY}`),
        fetch(`${FORECAST_URL}?q=${encodeURIComponent(targetCity)}&units=metric&appid=${API_KEY}`)
      ]);

      if (!weatherRes.ok) {
        const data = await weatherRes.json();
        throw new Error(data?.message || 'Unable to load weather data.');
      }

      if (!forecastRes.ok) {
        const data = await forecastRes.json();
        throw new Error(data?.message || 'Unable to load forecast data.');
      }

      const weatherPayload = await weatherRes.json();
      const forecastPayload = await forecastRes.json();

      const midday = forecastPayload.list.filter((item) => item.dt_txt.endsWith('12:00:00'));
      const forecastItems = (midday.length ? midday : forecastPayload.list).slice(0, 5);

      setWeather(weatherPayload);
      setForecast(forecastItems);
      setCity(weatherPayload.name);
    } catch (err) {
      setWeather(null);
      setForecast([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchWeather(input);
  };

  return (
    <div className="app-shell">
      <header>
        <p>{greeting}</p>
        <form onSubmit={handleSubmit} className="search-form">
          <label htmlFor="city">City</label>
          <input
            id="city"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="e.g. Berlin"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </header>

      {error && <div className="status error">{error}</div>}

      {weather && (
        <main>
          <section className="weather-card">
            <div>
              <h1>
                {weather.name}, {weather.sys.country}
              </h1>
              <p className="temperature">{Math.round(weather.main.temp)}°C</p>
              <p className="description">{weather.weather[0].description}</p>
              <div className="details">
                <div>
                  <strong>Feels like</strong>
                  <span>{Math.round(weather.main.feels_like)}°C</span>
                </div>
                <div>
                  <strong>Humidity</strong>
                  <span>{weather.main.humidity}%</span>
                </div>
                <div>
                  <strong>Wind</strong>
                  <span>{Math.round(weather.wind.speed)} m/s</span>
                </div>
              </div>
            </div>
            <div className="sun">
              <p>
                Sunrise: {formatTime(weather.sys.sunrise, { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p>
                Sunset: {formatTime(weather.sys.sunset, { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </section>

          {forecast.length > 0 && (
            <section className="forecast-grid">
              {forecast.map((item) => (
                <article key={item.dt}>
                  <p className="forecast-date">{formatDate(item.dt)}</p>
                  <p className="forecast-temp">{Math.round(item.main.temp)}°C</p>
                  <p className="forecast-desc">{item.weather[0].main}</p>
                  <p className="forecast-extra">{item.weather[0].description}</p>
                </article>
              ))}
            </section>
          )}
        </main>
      )}

      {!weather && !error && !loading && <div className="status">Enter a city to see current conditions.</div>}
    </div>
  );
}

export default App;
