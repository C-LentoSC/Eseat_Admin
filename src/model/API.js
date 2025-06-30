import axios from 'axios';
import {jwtDecode} from "jwt-decode";

// Create Axios instance
const api = axios.create({
     // baseURL: 'http://3.15.2.57:8000/api/',
    // baseURL: 'http://127.0.0.1:8000/api/',
    //  baseURL: 'https://modernliving.lk/api/',
    baseURL:"http://ec2-13-212-24-240.ap-southeast-1.compute.amazonaws.com:8000/api/",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Set authorization header if token exists
api.interceptors.request.use(async (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            sessionStorage.removeItem('token');
            sessionStorage.setItem('isAuthenticated','false')
            alert('Session expired. Please log in again.');
            window.location.href = '/signin';
            throw new Error('Token expired');
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});
export const api2 = axios.create({
    // baseURL: 'https://mintberryco.com/api/',
    // baseURL: 'http://127.0.0.1:8000/api/',
    // baseURL: 'https://modernliving.lk/api/',
    baseURL:"http://ec2-13-212-24-240.ap-southeast-1.compute.amazonaws.com:8000/api/",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Set authorization header if token exists
api2.interceptors.request.use(async (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            sessionStorage.removeItem('token');
            sessionStorage.setItem('isAuthenticated','false')
            alert('Session expired. Please log in again.');
            window.location.href = '/signin';
            throw new Error('Token expired');
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});


export default api;
