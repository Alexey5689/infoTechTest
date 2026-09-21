// Подписок нет в book.yaml, поэтому это чисто клиентская мок-реализация поверх localStorage.
// Формат записи { authorId, phone, date } сохранён — в браузерах уже могут лежать такие данные.

const STORAGE_KEY = 'subscriptions';

const readAll = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

export const subscriptionsApi = {
    async create({ authorId, phone }) {
        const subscription = { authorId, phone, date: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...readAll(), subscription]));
        return subscription;
    },

    async listByAuthor(authorId) {
        return readAll().filter((subscription) => subscription.authorId === authorId);
    },
};
