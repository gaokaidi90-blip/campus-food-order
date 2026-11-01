import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Res } from '@campus-food/shared';
/**
 * 创建 axios 实例
 */
declare const request: AxiosInstance;
export default request;
/**
 * 封装 GET 请求
 */
export declare function get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Res<T>>>;
/**
 * 封装 POST 请求
 */
export declare function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<Res<T>>>;
/**
 * 封装 PUT 请求
 */
export declare function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<Res<T>>>;
/**
 * 封装 DELETE 请求
 */
export declare function del<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<Res<T>>>;
