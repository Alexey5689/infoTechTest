// Начальные данные для мок-«базы». Здесь только данные — без логики.

export const authorsSeed = [
    { id: 1, full_name: 'Лев Толстой' },
    { id: 2, full_name: 'Фёдор Достоевский' },
    { id: 3, full_name: 'Михаил Булгаков' },
];

export const booksSeed = [
    {
        id: 1,
        title: 'Война и мир',
        year: 2024,
        description: 'Эпический роман о войне 1812 года',
        isbn: '978-0-123456-78-9',
        cover_url: '',
        author_ids: [1],
    },
    {
        id: 2,
        title: 'Преступление и наказание',
        year: 2023,
        description: 'Психологический роман о морали',
        isbn: '978-0-123456-79-0',
        cover_url: '',
        author_ids: [2],
    },
    {
        id: 3,
        title: 'Мастер и Маргарита',
        year: 2024,
        description: 'Роман о творчестве и любви',
        isbn: '978-0-123456-80-6',
        cover_url: '',
        author_ids: [3],
    },
    {
        id: 4,
        title: 'Анна Каренина',
        year: 2024,
        description: 'Роман о жизни и отношениях',
        isbn: '978-0-123456-81-3',
        cover_url: '',
        author_ids: [1],
    },
];
