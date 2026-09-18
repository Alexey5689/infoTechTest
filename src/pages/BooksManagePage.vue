<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-6xl mx-auto px-4">
            <h1 class="text-4xl font-bold mb-8">Управление книгами</h1>

            <div class="bg-white rounded-lg p-6 mb-8 border border-gray-200">
                <h2 class="text-xl font-bold mb-4">{{ editingId ? 'Редактировать' : 'Добавить новую' }} книгу</h2>

                <!-- Общая ошибка (если что-то пошло не так) -->
                <div v-if="generalError" class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                    {{ generalError }}
                </div>

                <!-- Уведомление об отправленных SMS -->
                <div v-if="smsNotice" class="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                    {{ smsNotice }}
                </div>

                <div class="grid md:grid-cols-2 gap-4 mb-1">
                    <div>
                        <input
                            v-model="title"
                            type="text"
                            placeholder="Название книги"
                            class="w-full border rounded px-3 py-2 focus:outline-none"
                            :class="getFieldError('title') ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'"
                        />
                        <p v-if="getFieldError('title')" class="text-red-500 text-xs mt-1">
                            {{ getFieldError('title') }}
                        </p>
                    </div>

                    <div>
                        <input
                            v-model.number="year"
                            type="number"
                            placeholder="Год выпуска"
                            class="w-full border rounded px-3 py-2 focus:outline-none"
                            :class="getFieldError('year') ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'"
                        />
                        <p v-if="getFieldError('year')" class="text-red-500 text-xs mt-1">
                            {{ getFieldError('year') }}
                        </p>
                    </div>
                </div>

                <div class="mb-1 mt-3">
                    <textarea
                        v-model="description"
                        placeholder="Описание"
                        class="w-full border rounded px-3 py-2 focus:outline-none resize-none"
                        :class="
                            getFieldError('description') ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        "
                        rows="3"
                    ></textarea>
                    <p v-if="getFieldError('description')" class="text-red-500 text-xs mt-1">
                        {{ getFieldError('description') }}
                    </p>
                </div>

                <div class="mb-1 mt-3">
                    <input
                        v-model="isbn"
                        type="text"
                        placeholder="ISBN"
                        class="w-full border rounded px-3 py-2 focus:outline-none"
                        :class="getFieldError('isbn') ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'"
                    />
                    <p v-if="getFieldError('isbn')" class="text-red-500 text-xs mt-1">
                        {{ getFieldError('isbn') }}
                    </p>
                </div>

                <div class="mb-4 mt-3">
                    <label class="block text-sm font-semibold mb-2">Обложка книги:</label>
                    <div class="flex gap-4">
                        <div class="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                @change="handleFileSelected"
                                class="w-full border rounded px-3 py-2 focus:outline-none"
                                :class="
                                    getFieldError('cover') ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                "
                            />
                            <p class="text-xs text-gray-500 mt-1">Макс. размер: 5MB (JPG, PNG, WebP)</p>
                            <p v-if="getFieldError('cover')" class="text-red-500 text-xs mt-1">
                                {{ getFieldError('cover') }}
                            </p>
                        </div>
                        <div
                            v-if="coverPreview"
                            class="w-32 h-40 border border-gray-300 rounded overflow-hidden shrink-0"
                        >
                            <img :src="coverPreview" :alt="title || 'Обложка'" class="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-semibold mb-2">Авторы:</label>
                    <div
                        class="flex flex-wrap gap-3 border rounded p-3 bg-gray-50"
                        :class="getFieldError('author_ids') ? 'border-red-500' : 'border-gray-300'"
                    >
                        <label
                            v-for="author in authorsStore.authors"
                            :key="author.id"
                            class="flex items-center cursor-pointer"
                        >
                            <input type="checkbox" :value="author.id" v-model.number="selectedAuthorIds" class="mr-2" />
                            <span>{{ author.full_name }}</span>
                        </label>
                    </div>
                    <p v-if="getFieldError('author_ids')" class="text-red-500 text-sm mt-2">
                        {{ getFieldError('author_ids') }}
                    </p>
                </div>

                <div class="flex gap-2">
                    <button
                        v-if="!editingId"
                        @click="handleCreateBook"
                        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
                    >
                        Добавить книгу
                    </button>
                    <button
                        v-else
                        @click="handleSaveBook(editingId)"
                        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
                    >
                        Сохранить изменения
                    </button>
                    <button
                        v-if="editingId"
                        @click="resetForm"
                        class="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded transition"
                    >
                        Отмена
                    </button>
                </div>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
                <BookCard
                    v-for="book in booksStore.books"
                    :key="book.id"
                    :book="book"
                    mode="manage"
                    @edit="handleEditBook(book)"
                    @delete="handleDeleteBook(book.id)"
                    @quick-edit="handleOpenQuickEdit(book)"
                />
            </div>

            <div v-if="booksStore.books.length === 0" class="text-center py-12">
                <p class="text-gray-500 text-lg">Нет ни одной книги. Добавьте первую!</p>
            </div>

            <QuickEditModal
                :isOpen="showQuickEditModal"
                :book="quickEditBook"
                @confirm="handleQuickEditConfirm"
                @cancel="showQuickEditModal = false"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBooksStore } from '../stores/booksStore';
import { useAuthorsStore } from '../stores/authorsStore';
import { useSubscriptionsStore } from '../stores/subscriptionsStore';
import { sendSmsNotification } from '../services/smsService';
import BookCard from '../components/BookCard.vue';
import QuickEditModal from '../components/QuickEditModal.vue';

const booksStore = useBooksStore();
const authorsStore = useAuthorsStore();
const subscriptionsStore = useSubscriptionsStore();

const title = ref('');
const year = ref(new Date().getFullYear());
const description = ref('');
const isbn = ref('');
const selectedAuthorIds = ref([]);
const editingId = ref(null);
const coverFile = ref(null);
const coverPreview = ref(null);

const errors = ref([]);
const generalError = ref('');
const smsNotice = ref('');

const quickEditBook = ref(null);
const showQuickEditModal = ref(false);

const getFieldError = (fieldName) => {
    const error = errors.value.find((e) => e.field === fieldName);
    return error ? error.message : null;
};

const validateBookForm = () => {
    const newErrors = [];

    if (!title.value || !title.value.trim()) {
        newErrors.push({ field: 'title', message: 'Название книги обязательно' });
    } else if (title.value.trim().length < 2) {
        newErrors.push({ field: 'title', message: 'Название должно быть не короче 2 символов' });
    }

    if (!year.value) {
        newErrors.push({ field: 'year', message: 'Год выпуска обязателен' });
    } else if (year.value < 1000 || year.value > new Date().getFullYear() + 1) {
        newErrors.push({ field: 'year', message: `Год должен быть между 1000 и ${new Date().getFullYear() + 1}` });
    }

    if (isbn.value && !/^[\d-]+$/.test(isbn.value)) {
        newErrors.push({ field: 'isbn', message: 'ISBN должен содержать только цифры и дефисы' });
    }

    if (!coverPreview.value) {
        newErrors.push({ field: 'cover', message: 'Файл обложки обязателен' });
    }

    if (selectedAuthorIds.value.length === 0) {
        newErrors.push({ field: 'author_ids', message: 'Выберите хотя бы одного автора' });
    }

    errors.value = newErrors;
    return newErrors.length === 0;
};

const notifySubscribers = async (book) => {
    let notifiedCount = 0;

    for (const author of book.authors) {
        const subscribers = subscriptionsStore.getSubscribersForAuthor(author.id);

        for (const subscriber of subscribers) {
            const message = `Вышла новая книга "${book.title}" автора ${author.full_name}!`;
            await sendSmsNotification(subscriber.phone, message);
            notifiedCount++;
        }
    }

    if (notifiedCount > 0) {
        smsNotice.value = `📱 Отправлено SMS-уведомлений: ${notifiedCount}`;
        setTimeout(() => {
            smsNotice.value = '';
        }, 5000);
    }
};

const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    errors.value = errors.value.filter((e) => e.field !== 'cover');

    if (!file.type.startsWith('image/')) {
        errors.value.push({ field: 'cover', message: 'Выберите файл изображения (JPG, PNG, WebP)' });
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        errors.value.push({ field: 'cover', message: 'Размер файла не должен превышать 5MB' });
        return;
    }

    coverFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        coverPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

// ==================== CRUD ====================

const resetForm = () => {
    title.value = '';
    year.value = new Date().getFullYear();
    description.value = '';
    isbn.value = '';
    selectedAuthorIds.value = [];
    editingId.value = null;
    coverFile.value = null;
    coverPreview.value = null;
    errors.value = [];
    generalError.value = '';
};

const handleCreateBook = async () => {
    generalError.value = '';

    if (!validateBookForm()) {
        generalError.value = 'Пожалуйста, исправьте ошибки в форме';
        return;
    }

    const authors = selectedAuthorIds.value.map((id) => authorsStore.getAuthor(id));

    const newBook = booksStore.createBook(
        {
            title: title.value.trim(),
            year: parseInt(year.value),
            description: description.value.trim(),
            isbn: isbn.value.trim(),
            cover_url: coverPreview.value,
        },
        authors,
    );

    await notifySubscribers(newBook);

    resetForm();
};

const handleEditBook = (book) => {
    editingId.value = book.id;
    title.value = book.title;
    year.value = book.year;
    description.value = book.description;
    isbn.value = book.isbn;
    selectedAuthorIds.value = book.authors.map((a) => a.id);
    coverPreview.value = book.cover_url;
    coverFile.value = null;
    errors.value = [];
    generalError.value = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSaveBook = (id) => {
    generalError.value = '';

    if (!validateBookForm()) {
        generalError.value = 'Пожалуйста, исправьте ошибки в форме';
        return;
    }

    const authors = selectedAuthorIds.value.map((id) => authorsStore.getAuthor(id));

    booksStore.updateBook(
        id,
        {
            title: title.value.trim(),
            year: parseInt(year.value),
            description: description.value.trim(),
            isbn: isbn.value.trim(),
            cover_url: coverPreview.value,
        },
        authors,
    );

    resetForm();
};

const handleDeleteBook = (id) => {
    if (confirm('Вы уверены, что хотите удалить эту книгу?')) {
        booksStore.deleteBook(id);
    }
};

const handleOpenQuickEdit = (book) => {
    quickEditBook.value = book;
    showQuickEditModal.value = true;
};

const handleQuickEditConfirm = (partialData) => {
    booksStore.patchBook(quickEditBook.value.id, partialData);
    showQuickEditModal.value = false;
    quickEditBook.value = null;
};
</script>
