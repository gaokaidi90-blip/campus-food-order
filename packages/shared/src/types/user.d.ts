/**
 * 用户实体
 */
export interface User {
    id: string;
    studentId: string;
    name: string;
    phone: string;
    avatar?: string;
    createdAt: string;
}
/**
 * 用户登录请求
 */
export interface UserLoginReq {
    studentId: string;
    password: string;
}
/**
 * 用户登录响应
 */
export interface UserLoginRes {
    token: string;
    user: User;
}
