import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

// ✅ Current weather
export async function getWeatherByCoords(lat: number, lon: number) {
  return axios
    .get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: process.env.NEXT_PUBLIC_OPENWEATHER_KEY,
        units: "metric",
      },
    })
    .then((res) => res.data);
}

// ✅ 5-day forecast
export async function getForecastByCoords(lat: number, lon: number) {
  return axios
    .get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: process.env.NEXT_PUBLIC_OPENWEATHER_KEY,
        units: "metric",
      },
    })
    .then((res) => res.data);
}
