<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h1 class="text-4xl font-bold text-center mb-2">Каталог книг</h1>
            <p class="text-gray-600 text-center mb-8">Инфотек</p>

            <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {{ error }}
            </div>

            <div class="mb-4">
                <label class="block text-sm font-semibold mb-2">Имя пользователя</label>
                <input
                    v-model="username"
                    type="text"
                    placeholder="admin"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div class="mb-6">
                <label class="block text-sm font-semibold mb-2">Пароль</label>
                <input
                    v-model="password"
                    type="password"
                    placeholder="любой"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    @keyup.enter="handleLogin"
                />
            </div>

            <button
                @click="handleLogin"
                :disabled="loading"
                class="w-full bg-green-500 hover:bg-green-500/70 disabled:bg-green-300 text-white font-semibold py-2 rounded mb-3 transition"
            >
                {{ loading ? 'Загрузка...' : 'Авторизация' }}
            </button>

            <button
                @click="handleGuestLogin"
                class="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded transition"
            >
                Продолжить как гость
            </button>

            <p class="text-gray-600 text-xs text-center mt-6">
                Для демо используйте любые username/password или кликните "Продолжить как гость"
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;
    error.value = '';

    const result = await authStore.login(username.value, password.value);

    if (result.success) {
        router.push('/catalog');
    } else {
        error.value = result.error;
    }

    loading.value = false;
};

const handleGuestLogin = () => {
    router.push('/catalog');
};
</script>
