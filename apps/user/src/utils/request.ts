import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Res } from '@campus-food/shared'
import { getStorage, removeStorage } from './storage'
import { TOKEN_KEY } from '@campus-food/shared'

/**
 * 创建 axios 实例
 * 配置基础 URL 和超时时间
 */
const request: AxiosInstance = axios.create({
  baseURL: '/api', // API 基础路径
  timeout: 10000, // 请求超时时间 10 秒
})

/**
 * 请求拦截器
 * 在每个请求发送前自动添加 token
 */
request.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = getStorage<string>(TOKEN_KEY)
    if (token) {
      // 将 token 添加到请求头
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理响应结果和错误
 */
request.interceptors.response.use(
  (response: AxiosResponse<Res<unknown>>) => {
    const { code, message } = response.data

    // code 200 表示请求成功
    if (code === 200) {
      return response
    }

    // 处理业务错误（code 不为 200）
    console.error('Business Error:', message)
    return Promise.reject(new Error(message))
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response?.status === 401) {
      // 401 未授权，清除 token 并跳转登录页
      removeStorage(TOKEN_KEY)
      window.location.href = '/login'
    }

    const message = error.response?.data?.message || error.message || '请求失败'
    console.error('HTTP Error:', message)
    return Promise.reject(error)
  }
)

export default request

/**
 * 封装 GET 请求
 * @param url 请求地址
 * @param config axios 配置项
 * @returns Promise<AxiosResponse<Res<T>>>
 */
export function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Res<T>>> {
  return request.get<Res<T>>(url, config)
}

/**
 * 封装 POST 请求
 * @param url 请求地址
 * @param data 请求体数据
 * @param config axios 配置项
 * @returns Promise<AxiosResponse<Res<T>>>
 */
export function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Res<T>>> {
  return request.post<Res<T>>(url, data, config)
}

/**
 * 封装 PUT 请求
 * @param url 请求地址
 * @param data 请求体数据
 * @param config axios 配置项
 * @returns Promise<AxiosResponse<Res<T>>>
 */
export function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Res<T>>> {
  return request.put<Res<T>>(url, data, config)
}

/**
 * 封装 DELETE 请求
 * @param url 请求地址
 * @param config axios 配置项
 * @returns Promise<AxiosResponse<Res<T>>>
 */
export function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Res<T>>> {
  return request.delete<Res<T>>(url, config)
}
