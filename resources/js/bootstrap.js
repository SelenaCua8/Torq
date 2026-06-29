import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// Agregá esto al final del archivo si no está
window.axios.defaults.withCredentials = true;