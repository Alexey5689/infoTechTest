<template>
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
            @click="$emit('change', currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
            Назад
        </button>

        <button
            v-for="page in visiblePages"
            :key="page"
            @click="$emit('change', page)"
            class="w-10 h-10 rounded border transition"
            :class="
                page === currentPage ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 hover:bg-gray-100'
            "
        >
            {{ page }}
        </button>

        <button
            @click="$emit('change', currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
        >
            Далее
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true,
    },
    totalPages: {
        type: Number,
        required: true,
    },
});

defineEmits(['change']);

const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(props.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
});
</script>
