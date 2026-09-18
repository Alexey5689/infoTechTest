<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-6xl mx-auto px-4">
            <h1 class="text-4xl font-bold mb-8">Каталог книг</h1>

            <div class="bg-white rounded-lg p-6 mb-8 border border-gray-200">
                <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Поиск по названию..."
                        class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        @input="currentPage = 1"
                    />
                    <select
                        v-model="filterYear"
                        class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        @change="currentPage = 1"
                    >
                        <option value="">Все годы</option>
                        <option v-for="year in years" :key="year" :value="year">
                            {{ year }}
                        </option>
                    </select>
                </div>
                <p class="text-gray-600">
                    Найдено: <span class="font-bold">{{ paginatedResult.pagination.total }}</span> книг
                    <span v-if="paginatedResult.pagination.total_pages > 1">
                        (страница {{ paginatedResult.pagination.page }} из {{ paginatedResult.pagination.total_pages }})
                    </span>
                </p>
            </div>

            <div v-if="paginatedResult.items.length > 0" class="grid md:grid-cols-3 gap-6">
                <BookCard
                    v-for="book in paginatedResult.items"
                    :key="book.id"
                    :book="book"
                    :isGuest="authStore.isGuest"
                    mode="catalog"
                    @subscribe="handleSubscribe(book.authors[0].id)"
                />
            </div>

            <div v-else class="text-center py-12">
                <p class="text-gray-500 text-lg">Книги не найдены</p>
            </div>

            <Pagination
                :currentPage="currentPage"
                :totalPages="paginatedResult.pagination.total_pages"
                @change="currentPage = $event"
            />

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
import { useAuthStore } from '../stores/authStore';
import { useBooksStore } from '../stores/booksStore';
import { useSubscriptionsStore } from '../stores/subscriptionsStore';
import BookCard from '../components/BookCard.vue';
import SubscribeModal from '../components/SubscribeModal.vue';
import Pagination from '../components/Pagination.vue';

const authStore = useAuthStore();
const booksStore = useBooksStore();
const subscriptionsStore = useSubscriptionsStore();

const searchQuery = ref('');
const filterYear = ref('');
const showSubscribeModal = ref(false);
const selectedAuthorForSubscribe = ref(null);

const currentPage = ref(1);
const perPage = 6;

const paginatedResult = computed(() => {
    return booksStore.getBooks({
        search: searchQuery.value,
        year: filterYear.value ? parseInt(filterYear.value) : null,
        page: currentPage.value,
        perPage: perPage,
    });
});

const years = computed(() => {
    return [...new Set(booksStore.books.map((b) => b.year))].sort((a, b) => b - a);
});

const handleSubscribe = (authorId) => {
    selectedAuthorForSubscribe.value = authorId;
    showSubscribeModal.value = true;
};

const confirmSubscribe = (phone) => {
    subscriptionsStore.subscribe(selectedAuthorForSubscribe.value, phone);

    alert(`Вы подписались!\nНа номер ${phone} придёт SMS, когда выйдет новая книга этого автора.`);

    showSubscribeModal.value = false;
};
</script>
