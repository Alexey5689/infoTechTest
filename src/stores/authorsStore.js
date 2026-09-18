import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useBooksStore } from './booksStore';

export const useAuthorsStore = defineStore('authors', () => {
    const authors = ref([
        { id: 1, full_name: 'Лев Толстой' },
        { id: 2, full_name: 'Фёдор Достоевский' },
        { id: 3, full_name: 'Михаил Булгаков' },
    ]);

    const getAuthors = (filters = {}) => {
        let result = [...authors.value];

        if (filters.search) {
            result = result.filter((a) => a.full_name.toLowerCase().includes(filters.search.toLowerCase()));
        }

        const total = result.length;
        const page = filters.page || 1;
        const perPage = filters.perPage || 20;
        const totalPages = Math.max(1, Math.ceil(total / perPage));

        const startIndex = (page - 1) * perPage;
        const items = result.slice(startIndex, startIndex + perPage);

        return {
            items,
            pagination: {
                total,
                page,
                per_page: perPage,
                total_pages: totalPages,
            },
        };
    };

    const getAuthor = (id) => authors.value.find((a) => a.id === id);

    const getAuthorBooks = (authorId) => {
        const booksStore = useBooksStore();
        return booksStore.books
            .filter((book) => book.authors.some((a) => a.id === authorId))
            .map((book) => ({ id: book.id, title: book.title, year: book.year }));
    };

    const createAuthor = (name) => {
        const newAuthor = {
            id: Math.max(...authors.value.map((a) => a.id), 0) + 1,
            full_name: name,
        };
        authors.value.push(newAuthor);
        return newAuthor;
    };

    const updateAuthor = (id, name) => {
        const author = getAuthor(id);
        if (author) {
            author.full_name = name;
        }
        return author;
    };

    const deleteAuthor = (id) => {
        const idx = authors.value.findIndex((a) => a.id === id);
        if (idx >= 0) {
            authors.value.splice(idx, 1);
            return true;
        }
        return false;
    };

    return {
        authors,
        getAuthors,
        getAuthor,
        getAuthorBooks,
        createAuthor,
        updateAuthor,
        deleteAuthor,
    };
});
