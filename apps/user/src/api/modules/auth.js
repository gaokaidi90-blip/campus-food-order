import { post, get } from '@/utils/request';
/**
 * 用户登录
 */
export function login(data) {
    return post('/user/login', data);
}
/**
 * 获取用户信息
 */
export function getProfile() {
    return get('/user/profile');
}
