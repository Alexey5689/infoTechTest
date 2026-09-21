import { authorsSeed, booksSeed } from './data';

// Мок «база данных» — живёт в памяти и сбрасывается при перезагрузке страницы.
// Обращаться к ней должен только слой src/api; при подключении реального бэкенда этот файл удаляется.
export const db = {
    authors: structuredClone(authorsSeed),
    books: structuredClone(booksSeed),
};

export const nextId = (rows) => Math.max(0, ...rows.map((row) => row.id)) + 1;
