import axios from 'axios';

export const getWeatherData = async (lat: number, lon: number) => {
  try {
    const response = await axios.get('/api/weather', {
      params: { lat, lon }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

export const getSydneyWeather = () => getWeatherData(-33.8688, 151.2093);
