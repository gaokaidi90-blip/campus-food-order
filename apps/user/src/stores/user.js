import { defineStore } from 'pinia';
import { ref } from 'vue';
import { TOKEN_KEY } from '@campus-food/shared';
import { setStorage, getStorage, removeStorage } from '@/utils/storage';
import { login as loginApi, getProfile } from '@/api';
export const useUserStore = defineStore('user', () => {
    const token = ref(getStorage(TOKEN_KEY) || '');
    const userInfo = ref(null);
    /**
     * 登录
     */
    async function login(studentId, password) {
        const { data } = await loginApi({ studentId, password });
        token.value = data.data.token;
        userInfo.value = data.data.user;
        setStorage(TOKEN_KEY, data.data.token);
        return data.data;
    }
    /**
     * 获取用户信息
     */
    async function fetchUserInfo() {
        const { data } = await getProfile();
        userInfo.value = data.data;
        return data.data;
    }
    /**
     * 登出
     */
    function logout() {
        token.value = '';
        userInfo.value = null;
        removeStorage(TOKEN_KEY);
    }
    /**
     * 是否已登录
     */
    const isLoggedIn = () => !!token.value;
    return {
        token,
        userInfo,
        login,
        fetchUserInfo,
        logout,
        isLoggedIn,
    };
});
