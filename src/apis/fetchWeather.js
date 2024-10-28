import { get } from './method';

export const fetchWeather = async ({ lng, lat }) => {
  return await get(`/weather/current?lat=${lat}&lng=${lng}`);
};
