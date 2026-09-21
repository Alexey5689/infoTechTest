import { subscriptionsApi } from '../api/subscriptionsApi';
import { sendSmsNotification } from './smsService';

/**
 * Рассылает SMS подписчикам авторов новой книги.
 * @param {{ title: string, authors: { id: number, full_name: string }[] }} book
 * @returns {Promise<number>} количество отправленных уведомлений
 */
export const notifyNewBook = async (book) => {
    let sent = 0;

    for (const author of book.authors) {
        const subscribers = await subscriptionsApi.listByAuthor(author.id);

        for (const subscriber of subscribers) {
            const message = `Вышла новая книга "${book.title}" автора ${author.full_name}!`;
            await sendSmsNotification(subscriber.phone, message);
            sent++;
        }
    }

    return sent;
};
