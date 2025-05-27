import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true, // Uncomment if you need to send cookies with requests
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('[Axios Error]', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
