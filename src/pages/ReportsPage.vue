<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <h1 class="text-4xl font-bold mb-8">ТОП-10 авторов по количеству книг</h1>

            <div class="bg-white rounded-lg p-6 mb-8 border border-gray-200">
                <label class="block text-sm font-semibold mb-2">Введите год:</label>
                <div class="flex gap-3 mb-1">
                    <input
                        v-model="yearInput"
                        type="number"
                        placeholder="Например, 2024"
                        class="border rounded px-3 py-2 focus:outline-none w-48"
                        :class="yearError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'"
                        @keyup.enter="loadReport"
                    />
                    <button
                        @click="loadReport"
                        class="bg-green-500 hover:bg-green-500/70 text-white px-6 py-2 rounded transition"
                    >
                        Показать
                    </button>
                </div>
                <p v-if="yearError" class="text-red-500 text-sm mb-4">{{ yearError }}</p>

                <div v-if="reportData" class="overflow-x-auto">
                    <p class="text-gray-600 mb-3">
                        Год: <span class="font-bold">{{ reportData.year }}</span>
                    </p>

                    <table v-if="reportData.items.length > 0" class="w-full">
                        <thead>
                            <tr class="border-b-2 border-gray-300">
                                <th class="text-left py-3 px-2 font-semibold">Место</th>
                                <th class="text-left py-3 px-2 font-semibold">Автор</th>
                                <th class="text-right py-3 px-2 font-semibold">Книг выпущено</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="author in reportData.items"
                                :key="author.author_id"
                                class="border-b border-gray-200 hover:bg-gray-50"
                            >
                                <td class="py-3 px-2">
                                    <span
                                        class="inline-block bg-yellow-400 text-yellow-900 font-bold w-8 h-8 rounded-full text-center pt-1"
                                    >
                                        {{ author.rank }}
                                    </span>
                                </td>
                                <td class="py-3 px-2 font-semibold">{{ author.full_name }}</td>
                                <td class="py-3 px-2 text-right font-bold text-lg">
                                    {{ author.books_count }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-else class="text-center py-8">
                        <p class="text-gray-500">Нет данных для этого года</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useReportsStore } from '../stores/reportsStore';

const reportsStore = useReportsStore();
const { report: reportData, error: yearError } = storeToRefs(reportsStore);

const yearInput = ref(String(new Date().getFullYear()));

const loadReport = () => reportsStore.fetchTopAuthors(yearInput.value);

onMounted(loadReport);
</script>
