/**
 * 认证相关的组合式函数
 */
export declare function useAuth(): {
    login: (studentId: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => boolean;
    userInfo: {
        id: string;
        studentId: string;
        name: string;
        phone: string;
        avatar?: string | undefined;
        createdAt: string;
    } | null;
};
