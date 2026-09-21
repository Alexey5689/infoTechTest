import { db, nextId } from '../mocks/db';
import { ApiError, notFound } from './errors';
import { paginate } from './paginate';
import { toBook } from './serializers';

// Контракт — /books из book.yaml. Сейчас реализован поверх мок-базы;
// для реального бэкенда достаточно заменить тела функций на axios-запросы.

const findRow = (id) => {
    const row = db.books.find((book) => book.id === id);
    if (!row) throw notFound('Книга');
    return row;
};

const assertAuthorsExist = (authorIds) => {
    const missing = authorIds.filter((id) => !db.authors.some((author) => author.id === id));
    if (missing.length > 0) {
        throw new ApiError(422, [{ field: 'author_ids', message: `Авторы не найдены: ${missing.join(', ')}` }]);
    }
};

export const booksApi = {
    // GET /books
    async list({ search, author_id, year, page, perPage } = {}) {
        let rows = db.books;

        if (search) {
            rows = rows.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()));
        }
        if (author_id) {
            rows = rows.filter((book) => book.author_ids.includes(author_id));
        }
        if (year) {
            rows = rows.filter((book) => book.year === year);
        }

        const { items, pagination } = paginate(rows, page, perPage);
        return { items: items.map(toBook), pagination };
    },

    // Расширение к book.yaml: список годов для фильтра каталога
    async getYears() {
        return [...new Set(db.books.map((book) => book.year))].sort((a, b) => b - a);
    },

    // GET /books/{id}
    async get(id) {
        return toBook(findRow(id));
    },

    // POST /books
    async create({ author_ids = [], ...fields }) {
        assertAuthorsExist(author_ids);

        const row = { id: nextId(db.books), ...fields, author_ids: [...author_ids] };
        db.books.push(row);
        return toBook(row);
    },

    // PUT /books/{id}
    async update(id, { author_ids, ...fields }) {
        const row = findRow(id);

        if (author_ids) {
            assertAuthorsExist(author_ids);
            row.author_ids = [...author_ids];
        }
        Object.assign(row, fields);
        return toBook(row);
    },

    // PATCH /books/{id}: пустые значения не перезаписывают существующие
    async patch(id, { author_ids, ...fields }) {
        const row = findRow(id);

        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                row[key] = value;
            }
        });
        if (author_ids && author_ids.length > 0) {
            assertAuthorsExist(author_ids);
            row.author_ids = [...author_ids];
        }
        return toBook(row);
    },

    // DELETE /books/{id}
    async remove(id) {
        const row = findRow(id);
        db.books.splice(db.books.indexOf(row), 1);
    },
};
