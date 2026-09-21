import { db } from '../mocks/db';

// Приводят строки мок-базы к схемам из book.yaml (Book, AuthorShort, BookShort).
// Возвращают новые объекты, поэтому состояние сторов не связано с «базой» по ссылке.

export const toAuthorShort = (author) => ({ id: author.id, full_name: author.full_name });

export const toBookShort = (book) => ({ id: book.id, title: book.title, year: book.year });

export const toBook = ({ author_ids, ...book }) => ({
    ...book,
    authors: author_ids
        .map((id) => db.authors.find((author) => author.id === id))
        .filter(Boolean)
        .map(toAuthorShort),
});
