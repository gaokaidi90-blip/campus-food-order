import axios from 'axios';
import { getStorage, removeStorage } from './storage';
import { TOKEN_KEY } from '@campus-food/shared';
/**
 * 创建 axios 实例
 */
const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
});
/**
 * 请求拦截器
 */
request.interceptors.request.use((config) => {
    // 添加 token
    const token = getStorage(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
/**
 * 响应拦截器
 */
request.interceptors.response.use((response) => {
    const { code, message } = response.data;
    if (code === 200) {
        return response;
    }
    // 处理业务错误
    console.error('Business Error:', message);
    return Promise.reject(new Error(message));
}, (error) => {
    // 处理 HTTP 错误
    if (error.response?.status === 401) {
        // 未授权，清除 token
        removeStorage(TOKEN_KEY);
        window.location.href = '/login';
    }
    const message = error.response?.data?.message || error.message || '请求失败';
    console.error('HTTP Error:', message);
    return Promise.reject(error);
});
export default request;
/**
 * 封装 GET 请求
 */
export function get(url, config) {
    return request.get(url, config);
}
/**
 * 封装 POST 请求
 */
export function post(url, data, config) {
    return request.post(url, data, config);
}
/**
 * 封装 PUT 请求
 */
export function put(url, data, config) {
    return request.put(url, data, config);
}
/**
 * 封装 DELETE 请求
 */
export function del(url, config) {
    return request.delete(url, config);
}
