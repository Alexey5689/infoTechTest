<template>
    <div class="bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="font-bold text-lg mb-3">{{ author.full_name }}</h3>
        <p class="text-gray-600 text-sm mb-4">Книг: {{ author.books.length }}</p>

        <div v-if="!isGuest" class="flex gap-2">
            <button
                @click="$emit('edit')"
                class="flex-1 bg-green-500 hover:bg-green-500/70 text-white px-3 py-2 rounded text-sm transition"
            >
                Редактировать
            </button>
            <button
                @click="$emit('delete')"
                class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition"
            >
                Удалить
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    author: {
        type: Object,
        required: true,
    },
    isGuest: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['edit', 'delete']);
</script>
