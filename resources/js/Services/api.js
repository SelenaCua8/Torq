import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

// Interceptor: adjunta el CSRF token de Laravel automáticamente en cada request
api.interceptors.request.use((config) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) config.headers['X-CSRF-TOKEN'] = token;
    return config;
});

// Interceptor: si el servidor devuelve 419 (CSRF expirado) redirige al login
api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 419) window.location.href = '/';
        return Promise.reject(err);
    }
);

export default api;
