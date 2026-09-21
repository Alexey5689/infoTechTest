import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../api/authApi';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || '');
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

    const isAuthenticated = computed(() => !!token.value);
    const isGuest = computed(() => !isAuthenticated.value);

    const login = async (username, password) => {
        try {
            const session = await authApi.login({ username, password });
            token.value = session.token;
            user.value = session.user;
            localStorage.setItem('token', session.token);
            localStorage.setItem('user', JSON.stringify(session.user));
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const logout = () => {
        token.value = '';
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return {
        token,
        user,
        isAuthenticated,
        isGuest,
        login,
        logout,
    };
});
