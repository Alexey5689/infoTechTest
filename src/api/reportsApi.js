import { db } from '../mocks/db';
import { ApiError } from './errors';

// Контракт — GET /reports/top-authors из book.yaml.

const yearError = (message) => new ApiError(400, [{ field: 'year', message }]);

export const reportsApi = {
    async getTopAuthors(year) {
        if (year === null || year === undefined || year === '' || isNaN(year)) {
            throw yearError('Параметр year не указан или неверен');
        }

        const yearNum = parseInt(year);
        const maxYear = new Date().getFullYear() + 1;

        if (!Number.isInteger(yearNum) || yearNum < 1000 || yearNum > maxYear) {
            throw yearError(`Год должен быть в диапазоне от 1000 до ${maxYear}`);
        }

        const authorCounts = {};
        db.books
            .filter((book) => book.year === yearNum)
            .forEach((book) => {
                book.author_ids.forEach((authorId) => {
                    authorCounts[authorId] = (authorCounts[authorId] || 0) + 1;
                });
            });

        const items = Object.entries(authorCounts)
            .map(([authorId, count]) => ({
                author_id: parseInt(authorId),
                full_name: db.authors.find((author) => author.id === parseInt(authorId))?.full_name,
                books_count: count,
            }))
            .sort((a, b) => b.books_count - a.books_count)
            .slice(0, 10)
            .map((item, idx) => ({ rank: idx + 1, ...item }));

        return { year: yearNum, items };
    },
};
