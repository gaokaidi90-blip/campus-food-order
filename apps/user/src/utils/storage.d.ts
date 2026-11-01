/**
 * 本地存储工具
 */
/**
 * 设置存储
 */
export declare function setStorage<T>(key: string, value: T): void;
/**
 * 获取存储
 */
export declare function getStorage<T>(key: string): T | null;
/**
 * 移除存储
 */
export declare function removeStorage(key: string): void;
/**
 * 清空存储
 */
export declare function clearStorage(): void;
