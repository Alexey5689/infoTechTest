<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 class="text-xl font-bold mb-4">Подписаться на автора</h2>
            <p class="text-gray-600 mb-4">
                Укажите номер телефона — мы пришлём SMS, когда выйдет новая книга этого автора
            </p>

            <input
                v-model="phone"
                type="tel"
                placeholder="+7 900 123-45-67"
                class="w-full border rounded px-3 py-2 mb-1 focus:outline-none"
                :class="error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'"
            />
            <p v-if="error" class="text-red-500 text-xs mb-4">{{ error }}</p>
            <p v-else class="text-xs text-gray-400 mb-4">Формат: +7XXXXXXXXXX</p>

            <div class="flex gap-2">
                <button
                    @click="confirm"
                    class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
                >
                    Подписаться
                </button>
                <button @click="cancel" class="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded transition">
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
});

const emit = defineEmits(['confirm', 'cancel']);
const phone = ref('');
const error = ref('');

watch(
    () => props.isOpen,
    (open) => {
        if (open) {
            phone.value = '';
            error.value = '';
        }
    },
);

const validatePhone = (value) => {
    const cleaned = value.replace(/[\s()-]/g, '');
    return /^\+?\d{10,15}$/.test(cleaned);
};

const confirm = () => {
    if (!phone.value.trim()) {
        error.value = 'Введите номер телефона';
        return;
    }

    if (!validatePhone(phone.value)) {
        error.value = 'Введите корректный номер телефона';
        return;
    }

    emit('confirm', phone.value.trim());
};

const cancel = () => {
    emit('cancel');
};
</script>
