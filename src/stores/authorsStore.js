import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authorsApi } from '../api/authorsApi';

const emptyPagination = () => ({ total: 0, page: 1, per_page: 20, total_pages: 1 });

export const useAuthorsStore = defineStore('authors', () => {
    const items = ref([]);
    const pagination = ref(emptyPagination());
    const current = ref(null);
    const loading = ref(false);
    const error = ref('');

    // Фильтры последней загрузки списка — чтобы обновлять список после изменений
    let lastFilters = {};
    // Защита от гонок: применяется только ответ на самый свежий запрос
    let listRequestId = 0;
    let detailRequestId = 0;

    const fetchAuthors = async (filters = lastFilters) => {
        lastFilters = filters;
        const requestId = ++listRequestId;
        loading.value = true;
        error.value = '';

        try {
            const data = await authorsApi.list(filters);
            if (requestId !== listRequestId) return;
            items.value = data.items;
            pagination.value = data.pagination;
        } catch (e) {
            if (requestId === listRequestId) error.value = e.message;
        } finally {
            if (requestId === listRequestId) loading.value = false;
        }
    };

    // Если автора нет, current остаётся null, а причина попадает в error
    const fetchAuthor = async (id) => {
        const requestId = ++detailRequestId;
        current.value = null;
        loading.value = true;
        error.value = '';

        try {
            const author = await authorsApi.get(id);
            if (requestId === detailRequestId) current.value = author;
        } catch (e) {
            if (requestId === detailRequestId) error.value = e.message;
        } finally {
            if (requestId === detailRequestId) loading.value = false;
        }
    };

    const createAuthor = async (fullName) => {
        const author = await authorsApi.create({ full_name: fullName });
        await fetchAuthors();
        return author;
    };

    const updateAuthor = async (id, fullName) => {
        const author = await authorsApi.update(id, { full_name: fullName });
        await fetchAuthors();
        return author;
    };

    const deleteAuthor = async (id) => {
        await authorsApi.remove(id);
        await fetchAuthors();
    };

    return {
        items,
        pagination,
        current,
        loading,
        error,
        fetchAuthors,
        fetchAuthor,
        createAuthor,
        updateAuthor,
        deleteAuthor,
    };
});
