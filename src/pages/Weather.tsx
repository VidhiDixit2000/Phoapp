import React, { useEffect, useState,useContext,useMemo } from 'react';
import { Data } from '../context/AuthContext';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
const Weather = () => {
const context = useContext(Data);
const navigate = useNavigate();
if (!context) {
  throw new Error("This component must be wrapped in AuthContext");
}

const {saveNotes} = context;

  const [now, setNow] = useState(new Date());
  const [lat, setLat] = useState<number>();
  const [lon, setLon] = useState<number>();
  const [weatherData, setWeatherData] = useState({weather:"",temp:0,airpressure:0,windspeed:0,humidity:0});
  useEffect(() => {navigator.geolocation.getCurrentPosition((position) => {
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
},[])

async function fetchWeather() {
const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=020b1791fc26f45a0edf2cc2e7c94d64`);


const data = await response.json();  
console.log(JSON.stringify(data));
setWeatherData({weather:data.weather[0].main,temp:data.main.temp,airpressure:data.main.pressure,windspeed:data.wind.speed,humidity:data.main.humidity});
  }
  
useEffect(() => {
  fetchWeather();
}, [lat, lon]);


  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const time= now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  //useMemo controls creation of debounce,NOT execution of debounce.
  // However, if we use useffect, along with debounce, make value as dependency var, so it will run on each input change, which w edont want.And if we use Savenotes as dependency var and use callback in the auth context, then useffect wont run(coz unlike usememo, useffect handle both creation and execution of the function) and if we dont then debounce will be recreated on each render, which we dont want either.
  //We can use useref as well, coz it gets createdGets created once,Never recreated,Keeps its internal timer safely,No dependency confusion
 const debounceSavednotes=useMemo(() => debounce((value:string)=>
 {
  
    saveNotes(value);
 },3000), [saveNotes]);
const handleonchange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = (event.target as HTMLInputElement).value;
    debounceSavednotes(value);
}
  return (
    <div>
      <div>
        <p>Weather: {weatherData.weather}</p>
      </div>
      <div>
        <div>Temperature: {(weatherData.temp - 273.15).toFixed(1)}°C</div>
        <div>Air Pressure: {weatherData.airpressure} mbar</div>
    </div>
    <div>
      <div>Wind Speed: {(weatherData.windspeed * 3.6).toFixed(1)} km/h</div>
      <div>Humidity: {weatherData.humidity}%</div>
    </div>
    <div>
      <p>Date: {day}-{month}-{year}</p>
      <p>
        Time: {time}
      </p>
      <div>
        <input type="text" placeholder="notes" onChange={handleonchange}/>
      </div>
     <div><button onClick={() => navigate("/moviewidget")}>Next</button></div>
    </div>
    </div>
  );
};

export default Weather;
