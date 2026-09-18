<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <button @click="router.back()" class="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-1">
                Назад к авторам
            </button>

            <div v-if="!author" class="bg-white rounded-lg p-8 border border-gray-200 text-center">
                <h1 class="text-2xl font-bold mb-2">Автор не найден</h1>
                <p class="text-gray-500 mb-6">Автор с ID {{ route.params.id }} не существует</p>
                <router-link
                    to="/authors"
                    class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition"
                >
                    Вернуться к авторам
                </router-link>
            </div>

            <!-- Детали автора -->
            <div v-else>
                <div class="bg-white rounded-lg border border-gray-200 p-8 mb-6">
                    <h1 class="text-3xl font-bold mb-2">{{ author.full_name }}</h1>
                    <p class="text-gray-500">Книг в каталоге: {{ authorBooks.length }}</p>

                    <button
                        v-if="authStore.isGuest"
                        @click="showSubscribeModal = true"
                        class="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
                    >
                        Подписаться на новые книги
                    </button>
                </div>

                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 class="text-xl font-bold mb-4">Книги автора</h2>

                    <div v-if="authorBooks.length > 0" class="space-y-3">
                        <router-link
                            v-for="book in authorBooks"
                            :key="book.id"
                            :to="`/books/${book.id}`"
                            class="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition"
                        >
                            <span class="font-semibold">{{ book.title }}</span>
                            <span class="text-gray-500 text-sm">{{ book.year }}</span>
                        </router-link>
                    </div>

                    <p v-else class="text-gray-500 text-center py-6">У этого автора пока нет книг в каталоге</p>
                </div>
            </div>

            <SubscribeModal
                :isOpen="showSubscribeModal"
                @confirm="confirmSubscribe"
                @cancel="showSubscribeModal = false"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useAuthorsStore } from '../stores/authorsStore';
import { useSubscriptionsStore } from '../stores/subscriptionsStore';
import SubscribeModal from '../components/SubscribeModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const authorsStore = useAuthorsStore();
const subscriptionsStore = useSubscriptionsStore();

const showSubscribeModal = ref(false);

const author = computed(() => {
    const id = parseInt(route.params.id);
    return authorsStore.getAuthor(id);
});

const authorBooks = computed(() => {
    if (!author.value) return [];
    return authorsStore.getAuthorBooks(author.value.id);
});

const confirmSubscribe = (phone) => {
    if (!author.value) return;

    subscriptionsStore.subscribe(author.value.id, phone);

    alert(`Вы подписались на ${author.value.full_name}!\n На номер ${phone} придёт SMS о новых книгах.`);

    showSubscribeModal.value = false;
};
</script>
