import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL



const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})


api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


api.interceptors.response.use((response)=> response, (error)=>{
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token')
       window.dispatchEvent(new Event('force-logout'))
    }
    return Promise.reject(error)
})


const posData = async<T>(path: string, data: any): Promise<T> => {
    const response = await api.post<T>(path, data)
    return response.data
}


const fetchData = async<T>(path: string): Promise<T> => {
    const response = await api.get<T>(path)
    return response.data
}

const updateData = async<T>(path: string, data: any): Promise<T> => {
    const response = await api.put<T>(path, data)
    return response.data
}

const deleteData = async<T>(path: string): Promise<T> => {
    const response = await api.delete<T>(path)
    return response.data
}

export { posData, fetchData, updateData, deleteData}