import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || '');
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

    const isAuthenticated = computed(() => !!token.value);
    const isGuest = computed(() => !isAuthenticated.value);

    const login = async (username, password) => {
        if (username && password) {
            const mockUser = { id: 1, username, role: 'user' };
            const mockToken = 'jwt_' + Date.now();
            token.value = mockToken;
            user.value = mockUser;
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
            return { success: true };
        }
        return { success: false, error: 'Неверные учётные данные' };
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
