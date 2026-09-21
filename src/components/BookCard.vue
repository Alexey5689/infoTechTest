<template>
    <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition">
        <div class="w-full h-64 mb-3 bg-gray-100 rounded border border-gray-300 overflow-hidden">
            <img
                v-if="book.cover_url && (book.cover_url.startsWith('data:') || book.cover_url.startsWith('http'))"
                :src="book.cover_url"
                :alt="book.title"
                class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Обложки пока нет
            </div>
        </div>
        <router-link
            v-if="mode === 'catalog'"
            :to="`/books/${book.id}`"
            class="font-bold text-lg mb-2 block hover:text-blue-600 transition"
        >
            {{ book.title }}
        </router-link>
        <h3 v-else class="font-bold text-lg mb-2">{{ book.title }}</h3>
        <p class="text-gray-600 text-sm mb-2">{{ book.year }}</p>
        <p class="text-gray-700 text-sm mb-3">{{ book.description }}</p>

        <div class="mb-3">
            <p class="text-xs font-semibold text-gray-500 mb-1">Авторы:</p>
            <div class="flex flex-wrap gap-2">
                <span
                    v-for="author in book.authors"
                    :key="author.id"
                    class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                >
                    {{ author.full_name }}
                </span>
            </div>
        </div>

        <div class="flex gap-2">
            <template v-if="mode === 'manage'">
                <button
                    @click="$emit('edit')"
                    class="flex-1 bg-green-500 hover:bg-green-500/70 text-white px-3 py-2 rounded text-sm transition"
                >
                    Редактировать
                </button>
                <button
                    @click="$emit('quick-edit')"
                    class="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm transition"
                    title="Быстрое изменение без загрузки обложки (PATCH)"
                >
                    Быстро
                </button>
                <button
                    @click="$emit('delete')"
                    class="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition"
                >
                    Удалить
                </button>
            </template>

            <template v-else>
                <button
                    v-if="isGuest"
                    @click="$emit('subscribe')"
                    class="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition"
                >
                    Подписаться
                </button>
            </template>
        </div>
    </div>
</template>

<script setup>
defineProps({
    book: {
        type: Object,
        required: true,
    },
    isGuest: {
        type: Boolean,
        default: false,
    },

    mode: {
        type: String,
        default: 'catalog',
        validator: (value) => ['catalog', 'manage'].includes(value),
    },
});

defineEmits(['edit', 'delete', 'subscribe', 'quick-edit']);
</script>
