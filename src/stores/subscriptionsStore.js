import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSubscriptionsStore = defineStore('subscriptions', () => {
    const subscriptions = ref(JSON.parse(localStorage.getItem('subscriptions') || '[]'));

    const subscribe = (authorId, phone) => {
        subscriptions.value.push({
            authorId,
            phone,
            date: new Date().toISOString(),
        });
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions.value));
    };

    const isSubscribed = (authorId, phone) => {
        return subscriptions.value.some((s) => s.authorId === authorId && s.phone === phone);
    };

    const getSubscribersForAuthor = (authorId) => {
        return subscriptions.value.filter((s) => s.authorId === authorId);
    };

    return {
        subscriptions,
        subscribe,
        isSubscribed,
        getSubscribersForAuthor,
    };
});
