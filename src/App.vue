<template>
    <div v-if="!isLoginPage">
        <nav class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 class="text-2xl font-bold">Инфотек</h1>
                <div class="flex gap-6 items-center">
                    <router-link to="/catalog" class="hover:text-blue-600 font-semibold">Каталог</router-link>
                    <router-link to="/authors" class="hover:text-blue-600 font-semibold">Авторы</router-link>
                    <router-link to="/reports" class="hover:text-blue-600 font-semibold">Отчёты</router-link>
                    <router-link
                        v-if="authStore.isAuthenticated"
                        to="/books-manage"
                        class="hover:text-blue-600 font-semibold"
                        >Управление</router-link
                    >

                    <button
                        v-if="!authStore.isAuthenticated"
                        @click="goToLogin"
                        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Вход
                    </button>
                    <span v-if="authStore.isAuthenticated" class="text-gray-600">
                        {{ authStore.user.username }}
                    </span>
                    <button
                        v-if="authStore.isAuthenticated"
                        @click="logout"
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Выход
                    </button>
                </div>
            </div>
        </nav>
    </div>

    <router-view />
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const isLoginPage = computed(() => {
    return router.currentRoute.value.path === '/login';
});

const goToLogin = () => {
    router.push('/login');
};

const logout = () => {
    authStore.logout();
    router.push('/login');
};
</script>
