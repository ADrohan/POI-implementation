const axios = require('axios');
const apiKey = process.env.apiKey;
//const apiKey = "aeb8641c6bcbc68e952995fa7210cd6f";

const Weather = {

  readWeather: async function(location) {
    let weather = null;
    let result = "success";
    const weatherRequest = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    try {
      const response = await axios.get(weatherRequest)
      if (response.status == 200) {
        weather = response.data
      }
    } catch (err) {
      console.log(err);
    }
    if (weather != null) {
      const report = {
        temp: Math.round(weather.main.temp - 273.15),
        feelsLike: Math.round(weather.main.feels_like - 273.15),
        clouds: weather.weather[0].description,
        windSpeed: weather.wind.speed,
        windDirection: weather.wind.deg,
        visibility: weather.visibility / 1000,
        humidity: weather.main.humidity
      }
      return report
    } else {
      return {result : "Unknown Location"};
    }
  },
}
module.exports = Weather;

