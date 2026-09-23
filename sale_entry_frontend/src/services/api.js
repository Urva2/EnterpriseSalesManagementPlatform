import axios from 'axios';

const api = axios.create({
    baseURL: `http://${window.location.hostname}:8080`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        // Don't send token for login or register requests
        if (
            config.url?.includes('/auth/login') ||
            config.url?.includes('/register')
        ) {
            return config;
        }

        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let refreshQueue = [];

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const original = error.config;

        // Never try to refresh a failed refresh call itself
        if (original?.url === '/auth/refresh') {
            isRefreshing = false;

            refreshQueue.forEach(({ reject }) => reject(error));
            refreshQueue = [];

            localStorage.removeItem('token');
            window.location.href = '/login';

            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (isRefreshing) {
                // Another request already triggered a refresh — wait for it
                return new Promise((resolve, reject) => {
                    refreshQueue.push({
                        resolve,
                        reject,
                        original,
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await api.post(
                    '/auth/refresh',
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.jwt;

                localStorage.setItem('token', newToken);

                original.headers['Authorization'] = `Bearer ${newToken}`;

                // Replay everything that was waiting
                refreshQueue.forEach(({ resolve, original: o }) => {
                    o.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(api(o));
                });

                refreshQueue = [];

                return api(original);

            } catch (refreshErr) {

                refreshQueue.forEach(({ reject }) => reject(refreshErr));
                refreshQueue = [];

                localStorage.removeItem('token');
                window.location.href = '/login';

                return Promise.reject(refreshErr);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;