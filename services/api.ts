import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor if needed (e.g., for auth)
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Une erreur est survenue';
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
    }
);

export default api;
