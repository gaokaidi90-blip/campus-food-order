import type { User, UserLoginReq, UserLoginRes } from '@campus-food/shared';
/**
 * 用户登录
 */
export declare function login(data: UserLoginReq): Promise<import("axios").AxiosResponse<import("@campus-food/shared").Res<UserLoginRes>, any, {}, any>>;
/**
 * 获取用户信息
 */
export declare function getProfile(): Promise<import("axios").AxiosResponse<import("@campus-food/shared").Res<User>, any, {}, any>>;
