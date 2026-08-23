import { useEffect, useState } from 'react';
import '../styles/Weather.css';

type WeatherState = {
  weather: string;
  temp: number;
  airpressure: number;
  windspeed: number;
  humidity: number;
};

const Weather = () => {
  const [now, setNow] = useState(new Date());
  const [lat, setLat] = useState<number>();
  const [lon, setLon] = useState<number>();

  // null rather than a zero-filled object. With temp starting at 0, the old
  // version rendered (0 - 273.15) = "-273.2°C" for the first frame, before
  // any data arrived.
  const [weatherData, setWeatherData] = useState<WeatherState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      },
      () => {
        // Previously only a console.log, so a user who denied location saw a
        // widget stuck on "--" with no explanation.
        setError("Location permission denied");
      }
    );

    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // This effect runs on mount too, when both are still undefined. Without
    // this guard it requested ?lat=undefined&lon=undefined, OpenWeather
    // returned an error object, and data.weather[0] threw a TypeError.
    if (lat === undefined || lon === undefined) return;

    let cancelled = false;

    async function fetchWeather() {
      try {
        // units=metric asks the API for Celsius directly, instead of
        // converting from Kelvin by hand on every render.
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Weather API returned ${response.status}`);
        }

        const data = await response.json();

        if (cancelled) return;

        setWeatherData({
          weather: data.weather[0].main,
          temp: data.main.temp,
          airpressure: data.main.pressure,
          windspeed: data.wind.speed,
          humidity: data.main.humidity,
        });
        setError(null);
      } catch (err) {
        if (!cancelled) {
          console.error("Could not load weather", err);
          setError("Couldn't load weather");
        }
      }
    }

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="weather-widget">
      <div className="weather-date-row">
        <span>
          {day}-{month}-{year}
        </span>
        <span>{time}</span>
      </div>

      {error ? (
        <div className="weather-error">{error}</div>
      ) : (
        <div className="weather-metrics-grid">
          <div className="weather-type">{weatherData?.weather ?? '--'}</div>

          <div className="weather-temp">
            {weatherData ? `${weatherData.temp.toFixed(1)}°C` : '--'}
          </div>
          <div className="weather-wind">
            Wind: {weatherData ? (weatherData.windspeed * 3.6).toFixed(1) : '--'} km/h
          </div>
          <div className="weather-pressure">
            Pressure: {weatherData?.airpressure ?? '--'} mbar
          </div>
          <div className="weather-humidity">
            Humidity: {weatherData?.humidity ?? '--'}%
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;