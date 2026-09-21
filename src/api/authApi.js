import { ApiError } from './errors';

// Контракт — POST /auth/login из book.yaml. Мок: подходят любые непустые логин и пароль.

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export const authApi = {
    async login({ username, password }) {
        if (!username || !password) {
            throw new ApiError(401, [{ field: 'password', message: 'Неверные учётные данные' }]);
        }

        return {
            token: 'jwt_' + Date.now(),
            expires_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
            user: { id: 1, username, role: 'user' },
        };
    },
};
