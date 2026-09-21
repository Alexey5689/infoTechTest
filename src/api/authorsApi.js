import { db, nextId } from '../mocks/db';
import { notFound } from './errors';
import { paginate } from './paginate';
import { toAuthorShort, toBookShort } from './serializers';

// Контракт — /authors из book.yaml. Реализован поверх мок-базы (см. booksApi).

const findRow = (id) => {
    const row = db.authors.find((author) => author.id === id);
    if (!row) throw notFound('Автор');
    return row;
};

const booksOf = (authorId) => db.books.filter((book) => book.author_ids.includes(authorId));

export const authorsApi = {
    // GET /authors. Расширение к book.yaml: в элементе списка есть books_count
    async list({ search, page, perPage } = {}) {
        let rows = db.authors;

        if (search) {
            rows = rows.filter((author) => author.full_name.toLowerCase().includes(search.toLowerCase()));
        }

        const { items, pagination } = paginate(rows, page, perPage);
        return {
            items: items.map((author) => ({ ...toAuthorShort(author), books_count: booksOf(author.id).length })),
            pagination,
        };
    },

    // GET /authors/{id}
    async get(id) {
        const author = findRow(id);
        return { ...toAuthorShort(author), books: booksOf(id).map(toBookShort) };
    },

    // POST /authors
    async create({ full_name }) {
        const row = { id: nextId(db.authors), full_name };
        db.authors.push(row);
        return toAuthorShort(row);
    },

    // PUT /authors/{id}
    async update(id, { full_name }) {
        const row = findRow(id);
        row.full_name = full_name;
        return toAuthorShort(row);
    },

    // DELETE /authors/{id}: автор снимается с его книг, сами книги остаются
    async remove(id) {
        const row = findRow(id);
        db.authors.splice(db.authors.indexOf(row), 1);
        db.books.forEach((book) => {
            book.author_ids = book.author_ids.filter((authorId) => authorId !== id);
        });
    },
};
