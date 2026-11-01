import type { User } from '@campus-food/shared';
export declare const useUserStore: import("pinia").SetupStoreDefinition<"user", {
    token: import("vue").Ref<string, string>;
    userInfo: import("vue").Ref<{
        id: string;
        studentId: string;
        name: string;
        phone: string;
        avatar?: string | undefined;
        createdAt: string;
    } | null, User | {
        id: string;
        studentId: string;
        name: string;
        phone: string;
        avatar?: string | undefined;
        createdAt: string;
    } | null>;
    login: (studentId: string, password: string) => Promise<import("@campus-food/shared").UserLoginRes>;
    fetchUserInfo: () => Promise<User>;
    logout: () => void;
    isLoggedIn: () => boolean;
}>;
