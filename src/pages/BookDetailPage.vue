<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <button @click="router.back()" class="text-blue-600 hover:text-blue-800 mb-6 flex items-center gap-1">
                Назад к каталогу
            </button>

            <div v-if="!book" class="bg-white rounded-lg p-8 border border-gray-200 text-center">
                <h1 class="text-2xl font-bold mb-2">Книга не найдена</h1>
                <p class="text-gray-500 mb-6">Книга с ID {{ route.params.id }} не существует</p>
                <router-link
                    to="/catalog"
                    class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition"
                >
                    Вернуться в каталог
                </router-link>
            </div>

            <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="grid md:grid-cols-2 gap-8 p-8">
                    <div class="w-full h-96 bg-gray-100 rounded border border-gray-300 overflow-hidden">
                        <img
                            v-if="
                                book.cover_url &&
                                (book.cover_url.startsWith('data:') || book.cover_url.startsWith('http'))
                            "
                            :src="book.cover_url"
                            :alt="book.title"
                            class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                            Обложка отсутствует
                        </div>
                    </div>

                    <div>
                        <h1 class="text-3xl font-bold mb-3">{{ book.title }}</h1>

                        <div class="flex flex-wrap gap-2 mb-4">
                            <span
                                v-for="author in book.authors"
                                :key="author.id"
                                class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                                {{ author.full_name }}
                            </span>
                        </div>

                        <div class="space-y-2 mb-6 text-gray-700">
                            <p><span class="font-semibold"> Год выпуска:</span> {{ book.year }}</p>
                            <p v-if="book.isbn"><span class="font-semibold"> ISBN:</span> {{ book.isbn }}</p>
                        </div>

                        <div v-if="book.description" class="mb-6">
                            <h2 class="font-semibold text-gray-500 text-sm mb-2">Описание:</h2>
                            <p class="text-gray-700 leading-relaxed">{{ book.description }}</p>
                        </div>

                        <button
                            v-if="authStore.isGuest"
                            @click="showSubscribeModal = true"
                            class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
                        >
                            Подписаться на автора
                        </button>

                        <router-link
                            v-else
                            to="/books-manage"
                            class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition"
                        >
                            Управление книгами
                        </router-link>
                    </div>
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
import { useAuthStore } from '../stores/authStore.js';
import { useBooksStore } from '../stores/booksStore.js';
import { useSubscriptionsStore } from '../stores/subscriptionsStore.js';
import SubscribeModal from '../components/SubscribeModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const booksStore = useBooksStore();
const subscriptionsStore = useSubscriptionsStore();

const showSubscribeModal = ref(false);

const book = computed(() => {
    const id = parseInt(route.params.id);
    return booksStore.getBook(id);
});

const confirmSubscribe = (phone) => {
    if (!book.value || book.value.authors.length === 0) return;

    subscriptionsStore.subscribe(book.value.authors[0].id, phone);

    alert(` Вы подписались!\n На номер ${phone} придёт SMS, когда выйдет новая книга этого автора.`);

    showSubscribeModal.value = false;
};
</script>
