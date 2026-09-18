<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 class="text-xl font-bold mb-1">Быстрое изменение</h2>

            <div class="mb-3">
                <label class="block text-sm font-semibold mb-1">Название</label>
                <input
                    v-model="form.title"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    :placeholder="book?.title"
                />
            </div>

            <div class="mb-3">
                <label class="block text-sm font-semibold mb-1">Год</label>
                <input
                    v-model.number="form.year"
                    type="number"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    :placeholder="String(book?.year)"
                />
            </div>

            <div class="mb-3">
                <label class="block text-sm font-semibold mb-1">Описание</label>
                <textarea
                    v-model="form.description"
                    rows="2"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
                    :placeholder="book?.description"
                ></textarea>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-semibold mb-1">ISBN</label>
                <input
                    v-model="form.isbn"
                    type="text"
                    class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    :placeholder="book?.isbn"
                />
            </div>

            <p class="text-xs text-gray-400 mb-4">
                Оставь поле пустым, если менять его не нужно — обновятся только заполненные
            </p>

            <div class="flex gap-2">
                <button
                    @click="submit"
                    class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
                >
                    Сохранить изменения
                </button>
                <button @click="close" class="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded transition">
                    Отмена
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    book: {
        type: Object,
        default: null,
    },
});

const emit = defineEmits(['confirm', 'cancel']);

const form = ref({
    title: '',
    year: null,
    description: '',
    isbn: '',
});

watch(
    () => props.isOpen,
    (open) => {
        if (open) {
            form.value = { title: '', year: null, description: '', isbn: '' };
        }
    },
);

const submit = () => {
    emit('confirm', {
        title: form.value.title || undefined,
        year: form.value.year || undefined,
        description: form.value.description || undefined,
        isbn: form.value.isbn || undefined,
    });
};

const close = () => {
    emit('cancel');
};
</script>
