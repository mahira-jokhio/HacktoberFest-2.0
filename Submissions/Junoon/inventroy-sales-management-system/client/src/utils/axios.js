import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your actual API base URL
  timeout: 10000,
  withCredentials: true, // Enables sending cookies with requests
});

export default instance;