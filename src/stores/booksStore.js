import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBooksStore = defineStore('books', () => {
    const books = ref([
        {
            id: 1,
            title: 'Война и мир',
            year: 2024,
            description: 'Эпический роман о войне 1812 года',
            isbn: '978-0-123456-78-9',
            cover_url: '',
            authors: [{ id: 1, full_name: 'Лев Толстой' }],
        },
        {
            id: 2,
            title: 'Преступление и наказание',
            year: 2023,
            description: 'Психологический роман о морали',
            isbn: '978-0-123456-79-0',
            cover_url: '',
            authors: [{ id: 2, full_name: 'Фёдор Достоевский' }],
        },
        {
            id: 3,
            title: 'Мастер и Маргарита',
            year: 2024,
            description: 'Роман о творчестве и любви',
            isbn: '978-0-123456-80-6',
            cover_url: '',
            authors: [{ id: 3, full_name: 'Михаил Булгаков' }],
        },
        {
            id: 4,
            title: 'Анна Каренина',
            year: 2024,
            description: 'Роман о жизни и отношениях',
            isbn: '978-0-123456-81-3',
            cover_url: '',
            authors: [{ id: 1, full_name: 'Лев Толстой' }],
        },
    ]);

    const getBooks = (filters = {}) => {
        let result = [...books.value];

        if (filters.search) {
            result = result.filter((b) => b.title.toLowerCase().includes(filters.search.toLowerCase()));
        }

        if (filters.author_id) {
            result = result.filter((b) => b.authors.some((a) => a.id === filters.author_id));
        }

        if (filters.year) {
            result = result.filter((b) => b.year === filters.year);
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

    const getBook = (id) => books.value.find((b) => b.id === id);

    const createBook = (bookData, authors) => {
        const newBook = {
            id: Math.max(...books.value.map((b) => b.id), 0) + 1,
            ...bookData,
            authors: authors,
        };
        books.value.push(newBook);
        return newBook;
    };

    const updateBook = (id, bookData, authors) => {
        const book = getBook(id);
        if (book) {
            Object.assign(book, bookData);
            if (authors) {
                book.authors = authors;
            }
        }
        return book;
    };

    const patchBook = (id, partialData, authors) => {
        const book = getBook(id);
        if (!book) return null;

        Object.keys(partialData).forEach((key) => {
            if (partialData[key] !== undefined && partialData[key] !== '') {
                book[key] = partialData[key];
            }
        });

        if (authors && authors.length > 0) {
            book.authors = authors;
        }

        return book;
    };

    const deleteBook = (id) => {
        const idx = books.value.findIndex((b) => b.id === id);
        if (idx >= 0) {
            books.value.splice(idx, 1);
            return true;
        }
        return false;
    };

    return {
        books,
        getBooks,
        getBook,
        createBook,
        updateBook,
        patchBook,
        deleteBook,
    };
});
