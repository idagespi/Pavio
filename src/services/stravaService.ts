import axios from 'axios';

export const getStravaAuthUrl = async () => {
  const response = await axios.get('/api/auth/strava/url');
  return response.data.url;
};

export const fetchStravaActivities = async (accessToken: string, after?: number) => {
  const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { after }
  });
  return response.data;
};

export const refreshStravaToken = async (refreshToken: string) => {
  const response = await axios.post('https://www.strava.com/api/v3/oauth/token', {
    client_id: process.env.VITE_STRAVA_CLIENT_ID, // We'll need to expose this or proxy it
    client_secret: process.env.VITE_STRAVA_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  return response.data;
};
