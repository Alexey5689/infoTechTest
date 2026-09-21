import { defineStore } from 'pinia';
import { ref } from 'vue';
import { booksApi } from '../api/booksApi';
import { notifyNewBook } from '../services/notificationService';

const emptyPagination = () => ({ total: 0, page: 1, per_page: 20, total_pages: 1 });

export const useBooksStore = defineStore('books', () => {
    const items = ref([]);
    const pagination = ref(emptyPagination());
    const current = ref(null);
    const years = ref([]);
    const loading = ref(false);
    const error = ref('');

    // Фильтры последней загрузки списка — чтобы обновлять список после изменений
    let lastFilters = {};
    // Защита от гонок: применяется только ответ на самый свежий запрос
    let listRequestId = 0;
    let detailRequestId = 0;

    const fetchBooks = async (filters = lastFilters) => {
        lastFilters = filters;
        const requestId = ++listRequestId;
        loading.value = true;
        error.value = '';

        try {
            const data = await booksApi.list(filters);
            if (requestId !== listRequestId) return;
            items.value = data.items;
            pagination.value = data.pagination;
        } catch (e) {
            if (requestId === listRequestId) error.value = e.message;
        } finally {
            if (requestId === listRequestId) loading.value = false;
        }
    };

    const fetchYears = async () => {
        years.value = await booksApi.getYears();
    };

    // Если книги нет, current остаётся null, а причина попадает в error
    const fetchBook = async (id) => {
        const requestId = ++detailRequestId;
        current.value = null;
        loading.value = true;
        error.value = '';

        try {
            const book = await booksApi.get(id);
            if (requestId === detailRequestId) current.value = book;
        } catch (e) {
            if (requestId === detailRequestId) error.value = e.message;
        } finally {
            if (requestId === detailRequestId) loading.value = false;
        }
    };

    // Создаёт книгу и уведомляет подписчиков её авторов; возвращает книгу и число отправленных SMS
    const createBook = async (payload) => {
        const book = await booksApi.create(payload);

        let notified = 0;
        try {
            notified = await notifyNewBook(book);
        } catch (e) {
            console.error('Не удалось отправить уведомления подписчикам', e);
        }

        await fetchBooks();
        return { book, notified };
    };

    const updateBook = async (id, payload) => {
        const book = await booksApi.update(id, payload);
        await fetchBooks();
        return book;
    };

    const patchBook = async (id, partialPayload) => {
        const book = await booksApi.patch(id, partialPayload);
        await fetchBooks();
        return book;
    };

    const deleteBook = async (id) => {
        await booksApi.remove(id);
        await fetchBooks();
    };

    return {
        items,
        pagination,
        current,
        years,
        loading,
        error,
        fetchBooks,
        fetchYears,
        fetchBook,
        createBook,
        updateBook,
        patchBook,
        deleteBook,
    };
});
