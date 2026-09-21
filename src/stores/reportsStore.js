import { defineStore } from 'pinia';
import { ref } from 'vue';
import { reportsApi } from '../api/reportsApi';

export const useReportsStore = defineStore('reports', () => {
    const report = ref(null);
    const error = ref('');

    const fetchTopAuthors = async (year) => {
        try {
            report.value = await reportsApi.getTopAuthors(year);
            error.value = '';
        } catch (e) {
            report.value = null;
            error.value = e.message;
        }
    };

    return {
        report,
        error,
        fetchTopAuthors,
    };
});
