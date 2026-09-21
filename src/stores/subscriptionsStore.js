import { defineStore } from 'pinia';
import { subscriptionsApi } from '../api/subscriptionsApi';

export const useSubscriptionsStore = defineStore('subscriptions', () => {
    const subscribe = (authorId, phone) => subscriptionsApi.create({ authorId, phone });

    return {
        subscribe,
    };
});
