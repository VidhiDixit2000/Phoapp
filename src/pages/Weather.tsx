import React, { useEffect, useState, useMemo } from 'react';
import '../styles/Weather.css';
const Weather = () => {


  const [now, setNow] = useState(new Date());
  const [lat, setLat] = useState<number>();
  const [lon, setLon] = useState<number>();
  const [weatherData, setWeatherData] = useState({ weather: "", temp: 0, airpressure: 0, windspeed: 0, humidity: 0 });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Latitude:", position.coords.latitude);
      setLat(position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);
      setLon(position.coords.longitude);
    },
      () => {
        console.log("Permission denied");
      }
    )
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [])

  async function fetchWeather() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=020b1791fc26f45a0edf2cc2e7c94d64`);


    const data = await response.json();
    console.log(JSON.stringify(data));
    setWeatherData({ weather: data.weather[0].main, temp: data.main.temp, airpressure: data.main.pressure, windspeed: data.wind.speed, humidity: data.main.humidity });
  }

  useEffect(() => {
    fetchWeather();
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
      <div className="weather-metrics-grid">
        <div className="weather-type border1">{weatherData.weather || '--'}</div>

        <div className="weather-temp">
          {(weatherData.temp - 273.15).toFixed(1)}°C
        </div>
        <div className="weather-wind">Wind: {(weatherData.windspeed * 3.6).toFixed(1)} km/h</div>
        <div className="weather-pressure">Pressure: {weatherData.airpressure} mbar</div>
        <div className="weather-humidity">Humidity: {weatherData.humidity}%</div>
      </div>


    </div>
  );
};

export default Weather;
