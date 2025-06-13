import axios from 'axios'

export const axiosService = axios.create({
    baseURL: 'https://formula-cardz-api.onrender.com/v1',
})

axiosService.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})