import { defineStore } from 'pinia';
import { useBooksStore } from './booksStore';
import { useAuthorsStore } from './authorsStore';

export const useReportsStore = defineStore('reports', () => {
    const getTopAuthors = (year) => {
        if (year === null || year === undefined || year === '' || isNaN(year)) {
            return {
                success: false,
                errors: [{ field: 'year', message: 'Параметр year не указан или неверен' }],
            };
        }

        const yearNum = parseInt(year);
        const currentYear = new Date().getFullYear();

        if (!Number.isInteger(yearNum) || yearNum < 1000 || yearNum > currentYear + 1) {
            return {
                success: false,
                errors: [{ field: 'year', message: `Год должен быть в диапазоне от 1000 до ${currentYear + 1}` }],
            };
        }

        const booksStore = useBooksStore();
        const authorsStore = useAuthorsStore();

        const yearBooks = booksStore.books.filter((b) => b.year === yearNum);
        const authorCounts = {};

        yearBooks.forEach((book) => {
            book.authors.forEach((author) => {
                authorCounts[author.id] = (authorCounts[author.id] || 0) + 1;
            });
        });

        const items = Object.entries(authorCounts)
            .map(([authorId, count]) => ({
                rank: 0,
                author_id: parseInt(authorId),
                full_name: authorsStore.getAuthor(parseInt(authorId))?.full_name,
                books_count: count,
            }))
            .sort((a, b) => b.books_count - a.books_count)
            .slice(0, 10)
            .map((item, idx) => ({ ...item, rank: idx + 1 }));

        return {
            success: true,
            data: {
                year: yearNum,
                items,
            },
        };
    };

    return {
        getTopAuthors,
    };
});
