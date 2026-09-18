<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-6xl mx-auto px-4">
            <h1 class="text-4xl font-bold mb-8">Авторы</h1>

            <div v-if="!authStore.isGuest" class="bg-white rounded-lg p-6 mb-8 border border-gray-200">
                <h2 class="text-xl font-bold mb-4">Добавить нового автора</h2>
                <div class="flex gap-2">
                    <div class="flex-1">
                        <input
                            v-model="newAuthorName"
                            type="text"
                            placeholder="ФИО автора"
                            class="w-full border rounded px-3 py-2 focus:outline-none"
                            :class="createError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'"
                            @keyup.enter="handleCreateAuthor"
                        />
                        <p v-if="createError" class="text-red-500 text-xs mt-1">{{ createError }}</p>
                    </div>
                    <button
                        @click="handleCreateAuthor"
                        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition h-fit"
                    >
                        Добавить
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-lg p-6 mb-8 border border-gray-200">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Поиск авторов..."
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    @input="currentPage = 1"
                />
                <p class="text-gray-600 mt-3">
                    Найдено: <span class="font-bold">{{ paginatedResult.pagination.total }}</span> авторов
                    <span v-if="paginatedResult.pagination.total_pages > 1">
                        (страница {{ paginatedResult.pagination.page }} из {{ paginatedResult.pagination.total_pages }})
                    </span>
                </p>
            </div>

            <div v-if="paginatedResult.items.length > 0" class="grid md:grid-cols-4 gap-6">
                <div
                    v-for="author in paginatedResult.items"
                    :key="author.id"
                    class="bg-white rounded-lg border border-gray-200 p-4"
                >
                    <div v-if="editingId !== author.id">
                        <router-link
                            :to="`/authors/${author.id}`"
                            class="font-bold text-lg mb-3 block hover:text-blue-600 transition"
                        >
                            {{ author.full_name }}
                        </router-link>
                        <p class="text-gray-600 text-sm mb-4">
                            Книг: {{ authorsStore.getAuthorBooks(author.id).length }}
                        </p>
                        <div v-if="!authStore.isGuest" class="flex gap-2">
                            <button
                                @click="handleEditAuthor(author)"
                                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition"
                            >
                                Редактировать
                            </button>
                            <button
                                @click="handleDeleteAuthor(author.id)"
                                class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                    <div v-else>
                        <input
                            v-model="editingName"
                            type="text"
                            class="w-full border rounded px-3 py-2 mb-1 focus:outline-none"
                            :class="editError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'"
                        />
                        <p v-if="editError" class="text-red-500 text-xs mb-2">{{ editError }}</p>
                        <div class="flex gap-2">
                            <button
                                @click="handleSaveAuthor(author.id)"
                                class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition"
                            >
                                Сохранить
                            </button>
                            <button
                                @click="cancelEdit"
                                class="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded text-sm transition"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-12">
                <p class="text-gray-500 text-lg">Авторы не найдены</p>
            </div>

            <Pagination
                :currentPage="currentPage"
                :totalPages="paginatedResult.pagination.total_pages"
                @change="currentPage = $event"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useAuthorsStore } from '../stores/authorsStore';
import Pagination from '../components/Pagination.vue';

const authStore = useAuthStore();
const authorsStore = useAuthorsStore();

const searchQuery = ref('');
const newAuthorName = ref('');
const editingId = ref(null);
const editingName = ref('');
const createError = ref('');
const editError = ref('');

const currentPage = ref(1);
const perPage = 8; // сколько авторов показываем на одной странице

const paginatedResult = computed(() => {
    return authorsStore.getAuthors({
        search: searchQuery.value,
        page: currentPage.value,
        perPage: perPage,
    });
});

const validateAuthorName = (name) => {
    if (!name || !name.trim()) {
        return 'ФИО автора обязательно';
    }
    if (name.trim().length < 3) {
        return 'ФИО должно быть не короче 3 символов';
    }
    return null;
};

const handleCreateAuthor = () => {
    const error = validateAuthorName(newAuthorName.value);
    if (error) {
        createError.value = error;
        return;
    }

    createError.value = '';
    authorsStore.createAuthor(newAuthorName.value.trim());
    newAuthorName.value = '';
};

const handleEditAuthor = (author) => {
    editingId.value = author.id;
    editingName.value = author.full_name;
    editError.value = '';
};

const cancelEdit = () => {
    editingId.value = null;
    editError.value = '';
};

const handleSaveAuthor = (id) => {
    const error = validateAuthorName(editingName.value);
    if (error) {
        editError.value = error;
        return;
    }

    authorsStore.updateAuthor(id, editingName.value.trim());
    editingId.value = null;
    editError.value = '';
};

const handleDeleteAuthor = (id) => {
    if (confirm('Вы уверены, что хотите удалить этого автора?')) {
        authorsStore.deleteAuthor(id);
    }
};
</script>
